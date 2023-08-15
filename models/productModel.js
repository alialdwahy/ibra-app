const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true,
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase: true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: String,
        require: true,
    },

    sold: {
        type: Number,
        default: 0,
    },
    quantity: {
        type:Number,
        require: true,
    },
    image:{
        type: Array,
    },
    color: {
        type: String,
        require:true,
    },
    brand: {
        type: String,
       require:true,
    },
    ratings: [{
        start: Number,
        postedby: {type: mongoose.Schema.Types.ObjectId,
             ref: "User"},
    },],
},
{timestamps: true},
);

//Export the model
module.exports = mongoose.model('Product', ProductSchema);