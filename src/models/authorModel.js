const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true

    },
    title:{
        type:String,
        enum:["mr","mrs","miss"]

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:Number,
        required:true
    }

},{timestamps:true})


module.exports = mongoose.model('authorModel',authorSchema)