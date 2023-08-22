
const { get } = require("mongoose");
const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");

const uniqid = require("uniqid");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("../controller/emailController");
const crypto = require("crypto");




const updateUser = asyncHandler(async (req, res) => {
    console.log();
    const {_id} = req.user;
    validateMongoDbId(_id);
    try {
        const updateaUser = await User.findByIdAndUpdate( _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },{

            new: true,
        });
        res.json(updateaUser);
   } catch (error) {
        throw new Error(error);
   }
});



const getallUser = asyncHandler(async (req, res) => {
    try {
         const getUsers = await User.find();
         res.json(getUsers);
    } catch (error) {
         throw new Error(error);
    }
});



const getaUser = asyncHandler(async (req, res) => {
const {id} = req.params;
validateMongoDbId(id);
    try {
        const getaUser = await User.findById( id );
        res.json(getaUser);
   } catch (error) {
        throw new Error(error);
   }
});




const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
        try {
            const deleteaUser = await User.findByIdAndDelete( id );
            res.json(deleteaUser);
       } catch (error) {
            throw new Error(error);
       }
    });



const blockUser = asyncHandler(async (req, res) => {
     const { id } = req.params;
     validateMongoDbId(id);
     try {
        const block = await User.findByIdAndUpdate(
            id, {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Blocked"
     });
     }catch (error) {
        throw new Error(error);
     }
});



const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
     try {
        const unblock = await User.findByIdAndUpdate(
            id, {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User UnBlocked"
     });
     }catch (error) {
        throw new Error(error);
     }
});



 const getWishlist = asyncHandler( async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate('wishlist');
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
 });

 const saveAddress = asyncHandler( async (req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id);
    try {
       const updateUser = await User.findByIdAndUpdate( _id, {
        address: req?.body?.address,
       },{
        new: true,
       }
       );
       res.json(updateUser);
    }catch (error) {
        throw new Error(error);
    }
 });

 const userCart = asyncHandler ( async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id); 
    try { 

        let products = [];
        const user = await User.findById(_id);

        const alreadyExistCart = await Cart.findOne({orderby: user._id});
        if(alreadyExistCart) {
            alreadyExistCart.remove();
        }
       for (let i = 0; i < cart.length; i++) {
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
        object.price = getPrice.price;
        products.push(object);
       }
      let cartTotal = 0;
      for (let i=0; i< products.length; i++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
      }
      let newCart = await new Cart({
        products,
        cartTotal,
        orderby: user?._id,
      }).save();
      res.json(newCart);
    } catch (error) {
        throw new Error(error);
    }
 });

 const getUserCart = asyncHandler ( async (req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error (error);
    }
 });


 const emptyCart = asyncHandler ( async (req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({orderby: user._id});
        res.json(cart);
    } catch (error) {
        throw new Error (error);
    }
 });


 const applyCoupon = asyncHandler (async (req, res) => {
    const { coupon } = req.body;
    const {_id } = req.user;
    validateMongoDbId(_id);
    const validCoupon = await Coupon.findOne({name: coupon});
       if (validCoupon == null) {
        throw new Error("Invalid Coupon");
       }
       const user = await User.findOne({_id});
       let { cartTotal } = await Cart.findOne({orderby: user._id,}).populate("products.product");
       let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
       await Cart.findOneAndUpdate({orderby: user._id},{totalAfterDiscount},{new: true},
        );
         res.json(totalAfterDiscount);
 });


 const createOrder = asyncHandler( async (req, res) => {
    const { COD, couponApplied } = req.body;
    const {_id } = req.user;
    validateMongoDbId(_id);

    try {
        if (!COD ) throw new Error("Create cash order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby: user._id});
        let finalAmout = 0 ;
        if ( couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount;
        } else {
            finalAmout = userCart.cartTotal * 100;
        }
        let nowOrder = await new Order({
            products: user.products,
            paymentIntent: {
              id: uniqid(),
              method: "COD",
              amount: finalAmout,
              status: "Cash on Delivery",
              created: Date.now,
              currency: 'usd',
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: { quantity: -item.count, sold: +item.count}},
                },
            };
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({message: "success"})
    } catch (error) {
        throw new Error(error);
    }
 });


 const getOrders = asyncHandler( async(req, res) => {
    const {_id } = req.user;
    validateMongoDbId(_id);
     try {
        const userorder  = await Order.findOne({ orderby: _id}).populate("products.product").exec();
        res.json(userorder)
     }catch (error) {
        throw new Error(error);
     }
 });

  const updateOrderStatus = asyncHandler (async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try{
    const updateOrderStat = await Order.findByIdAndUpdate(
        id, {
        orderStatus: status,
        paymentIntent: {
            status: status,
        },
    },{
        new: true
    },
    );
    res.json(updateOrderStat);
}catch (error){
    throw new Error(error);
}
  });


module.exports = {
     getallUser,
      getaUser, 
      deleteaUser,
       updateUser ,
       blockUser,
       unBlockUser,
       getWishlist,
       saveAddress,
       userCart,
       getUserCart,
       emptyCart,
       applyCoupon,
       createOrder,
       getOrders,
       updateOrderStatus
};