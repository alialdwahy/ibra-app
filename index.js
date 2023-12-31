const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const colorRouter = require("./routes/colorRoute");
const couponRouter = require("./routes/couponRoute");
const productCategoryRouter = require("./routes/productCategoryRoute");
const blogCategoryRouter = require("./routes/blogCategoryRoute");
const brandRouter = require("./routes/brandRoute");
const enquiryRouter = require("./routes/enquiryRoute")
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const  cors =  require("cors");
dbConnect();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());


app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product-category", productCategoryRouter);
app.use("/api/blog-category", blogCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enquiryRouter);
 
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running at Port ${PORT}`);
});