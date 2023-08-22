const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },],
    image: {
        type: String,
        default: "https://www.istockphoto.com/photo/blogging-blog-concepts-ideas-with-worktable-gm922745190-253297921",
    },
    author: {
        type: String,
        default: "Admin",
    },
    images:[],
},
{
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps:true,
}
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);