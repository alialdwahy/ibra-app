
const { get } = require("mongoose");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");


const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controller/emailController");
const crypto = require("crypto");



const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new  Error("User Already Exists");
        
    }
});


const loginUser = asyncHandler( async (req, res ) => {
    const {email, password} = req.body;

    const findUser = await User.findOne({ email });
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        },
        {
            new: true
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
res.json({
    _id: findUser?._id,
    mobile: findUser?.mobile,
    firstname: findUser?.firstname,
    lastname: findUser?.lastname,
   email: findUser?.email,
   token: generateToken(findUser._id),
});
    }else{
        throw new Error("Invalid Credentials");
    }
});




const loginAdmin = asyncHandler( async (req, res ) => {
    const {email, password} = req.body;
     const findAdmin = await User.findOne({email});
     if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && await findAdmin .isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken,
        },
        {
            new: true
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
res.json({
    _id: findAdmin?._id,
    mobile: findAdmin?.mobile,
    firstname: findAdmin?.firstname,
    lastname: findAdmin?.lastname,
   email: findAdmin?.email,
   token: generateToken(findAdmin._id),
});
    }else{
        throw new Error("Invalid Credentials");
    }
});




 const handlerRefreshToken = asyncHandler(async (req, res) => {
     const cookie = req.cookies;
     if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
     const refreshToken = cookie.refreshToken;
     const user = await User.findOne({ refreshToken });
     if (!user) throw new Error("No Refresh token present in db or not matched");
     jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token");
        } 
       const accessToken = generateToken(user?._id);
       res.json({ accessToken });
     });
 });



 const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
 });

 const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const {password} = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
       user.password = password;
       console.log(password);
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }  else {
        res.json(user);
    }
 });

 const forgotPasswordToken = asyncHandler(async(req, res) => {
      const { email } = req.body;
      const user = await User.findOne({email});
      if (!user) throw new Error("User not found with this email");
      try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. 
        <a href = 'http://localhost:5000/api/user/reset-password/${token}'> Click Here</>`;
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);

      } catch (error) {
        throw new Error(error);
      }
 });


 const resetPassword = asyncHandler( async(req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hes");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
       
    });
    console.log(Date.now());
    if (!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires= undefined;
    await user.save();
    res.json(user);
 });

 

module.exports = {
       createUser,
       loginUser,
       handlerRefreshToken,
       logout,
       updatePassword,
       forgotPasswordToken,
       resetPassword,
       loginAdmin,
};