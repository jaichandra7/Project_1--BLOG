const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"authorModel"
    },
    tags:{
        type:Array
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:Array
    },
    deletedAt:{
        type:String,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:{
        type:String,
        default:null
    },
    isPublished:{
        type:Boolean,
        default:false
    }





},{timestamps:true})


module.exports = mongoose.model('blogModel',blogSchema)