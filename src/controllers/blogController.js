const  mongoose = require('mongoose')
const BlogModel = require('../models/blogModel')

const createBlog = async function(req,res){
  try{
    let data = req.body

    if (!Object.keys(data).length) 
    return 
    res.status(400).send({ status: false, msg: "input can't be empty" })

    const auth = data.authorId
    if(!auth){
        res.status(400).send({status:false, msg:"authorid is required"})
    }
    
    if(!mongoose.isValidObjectId(auth)){
      return res.status(400).send({status:false,msg:"invalid authorId"})
    }
    const createData = await BlogModel.create(data)
    res.status(400).send({msg:createData})
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
}
}

const getblogs = async function(req,res){
try{
  // let authorId=req.query.authorId
  // let category=req.query.category
  // let tags=req.query.tags
  // let subCategory=req.query.subCategory
  let query=req.query

  let filterdata={isPublished:false,isDeleted:false}
      // filterdata.authorId=authorId
  //     filterdata.category=category
  //     filterdata.tags=tags
  //     filterdata.subCategory=subCategory
  //     console.log(filterdata)
  // const getblog = await BlogModel.find(filterdata)
  // const filterblog = await BlogModel.find({$and:[{filterdata},{$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]}]})
  const getblog= await BlogModel.find({$and:[{filterdata},query]})
  if(getblog.Length===0){
    return res.status(404).send({status:false,msg:"no user foung"})
  }
  res.status(200).send({status:true,data:getblog})
  // if(!getblog){
  //   res.status(404).send({msg:"No blogId exists"})
  // }
}
catch (err) {
  console.log("This is the error :", err.message)
  res.status(500).send({ msg: "Error", error: err.message })
}

}

const updateBlog = async function(req, res){
  try{
  let blogId=req.params._id
  let data=req.body
  let tag=data.tag
  let subCategory=data.subCategory
  let title=data.title
  let body= data.body

  if (!blogId)
  return 
  res.status(400).send({ status: false, msg: "path params Id is Required" })

  if (!Object.keys(data).length) 
  return 
  res.status(400).send({ status: false, msg: "input can't be empty" })

  if (!isValidString(data.title))
  return 
  res.status(400).send({ status: false, msg: "title is Required" })

  if (!isValidString(data.body)) 
  return
   res.status(400).send({ status: false, msg: "body is Required" })

  if (!isValidString(data.subcategory)) 
  return
  res.status(400).send({ status: false, msg: "SubCategory is Required" })

  if (!isValidString(data.tags)) 
  return 
  res.status(400).send({ status: false, msg: "tags is Required" })

  const checkBlog= await BlogModel.find({_id:blogId})
  if(!checkBlog)return res.status(404).send({ status: false, msg: "Blog Not Found" })

  if(checkblog.isDeleted===true){
    return res.status(404).send({status:false,msg:"we cannot modify the deleted blog"})
  }
  else{
    const updatedBlog= await BlogModel.findOneAndUpdate({_id:blogId},{title:title,body:body,isPublished:true,publishedAt:Date.now()},{new:true},)
    updatedblog.save()

    if(data.subCategory){
   updatedBlog.subCategory.push(subCategory)}
   else{
   updatedBlog.tags.push(tag)}
   res.status(200).send({msg:true,data:updatedBlog})
  }
}
catch (err) {
   console.log("This is the error :", err.message)
    res.status(500).send({ error: err.message })

  }
}

// let isValidString=mongoose.isValidString;
  
const deleteblog1 = async function(req,res){
        try {  
      let blogId=req.params._id
      if (!blogId) {
        return res.status(404).send({msg:"No blogId exists"});
      }
      let updatedblog = await BlogModel.findByIdAndUpdate({_id:blogId },{isDeleted:true,deletedAt:Date.now()},{new:true});
      res.status(200).send({ status:true, data: updatedblog });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
 const deleteblog2 = async function(req,res){
        try {  
      let authorId=req.query.authorId
      let category=req.query.category
      let tag=req.query.tag
      let subCategory=req.query.subCategory
      let updatedBlog = await BlogModel.updateMany({$or:[{authorId:authorId},{category:category},{tags:tag},{subCategory:subCategory}]},{$set:{isDeleted:true,deletedAt:Date.now()}},{new:true});
      // let updatedblog = await BlogModel.findOneAndUpdate({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]},
      //  {$set:{isDeleted:true,deletedAt:new Date(Date.now())}},{new:true});
      res.status(200).send({ status:true, data: updatedBlog });
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

module.exports.createBlog =  createBlog
module.exports.deleteblog1 = deleteblog1
module.exports.deleteblog2 = deleteblog2
module.exports.getblogs = getblogs
module.exports. updateBlog= updateBlog

