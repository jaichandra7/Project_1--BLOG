const  mongoose = require('mongoose')
const BlogModel = require('../models/blogModel')

const createBlog = async function(req,res){
  try{
    let data = req.body
    const auth = data.authorId
    
    if(!auth){
        res.status(400).send({status:false, msg:"author is required"})
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
  let authorId=req.query.authorId
  let category=req.query.category
  let tags=req.query.tags
  let subCategory=req.query.subCategory

  const filterblog = await BlogModel.find({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]})
  const getblog = await BlogModel.find({$and:[{isPublished:true},{isDeleted:true}]})

  if(!getblog){
    res.status(404).send("no such blogs found")
  }

  res.status(200).send({msg:filterblog,getblog})

}
catch (err) {
  console.log("This is the error :", err.message)
  res.status(500).send({ msg: "Error", error: err.message })
}

}

const updateBlog = async function(req, res){
  try{
  let blogId=req.params._id;
  console.log(blogId)
  let data=req.body
  console.log(data)
  let tag=data.tag
  let subCategory=data.subCategory
  let title=data.title
  let body= data.body
  const upblog= await BlogModel.find({_id:blogId})
  console.log(upblog)
  if(upblog[0].isDeleted===true){
    return res.status(404).send({status:false,msg:"we cannot modify the deleted blog"})
  }else{
    const updatedblog= await BlogModel.findOneAndUpdate({_id:blogId},{title:title,body:body,isPublished:true,publishedAt:new Date(Date.now())},{new:true},)
    updatedblog.save()
    if(data.subCategory){
   updatedblog.subCategory.push(subCategory)}
   else{
   updatedblog.tags.push(tag)}
   res.status(200).send({msg:true,data:updatedblog})
  }
}
catch (err) {
   console.log("This is the error :", err.message)
    res.status(500).send({ error: err.message })

  }
}

  // let isValidString=mongoose.isValidString;
  

  // if(!BlogModel){
  //      res.status(400).send({status:false, msg:"No such Blog exist"})
  //  }

  // if (!Object.keys(data).length) 
  // return 
  // res.status(400).send({ status: false, msg: "input can't be empty" })
  
  // if (!isValidString(data.title))
  // return 
  // res.status(400).send({ status: false, msg: "title is Required" })

  // if (!isValidString(data.body)) 
  // return
  //  res.status(400).send({ status: false, msg: "body is Required" })

  // if (!isValidString(data.subcategory)) 
  // return
  // res.status(400).send({ status: false, msg: "SubCategory is Required" })

  // if (!isValidString(data.tags)) 
  // return 
  // res.status(400).send({ status: false, msg: "tags is Required" })

  // let subcategory=blogId.subcategory
  // console.log(subcategory)
  //     subcategory.push(message)

  // let tags=data.tags
  // tags.push(message)

// let checkBlog = await blogModel.findById(_id)  

//     if(!checkBlog)return res.status(404).send({ status: false, msg: "Blog Not Found" })

//     if (checkBlog.isDeleted == true) return res.status(400).send({ status: false, msg: "This blog is already Deleted" })
    

//      let update = await BlogModel.findOneAndUpdate({_id:blogId},{subcategory:message},{new:trusted})
    
//      res.status(201).send({status:true,msg:update});
    // let update = await blogModel.findByIdAndUpdate(blog_Id,

    //   { $push:{tags:data.tags,subcategory:data.subcategory},title:data.title,body:data.body,isPublished: true, publishedAt: new Date()  },
      
    //   { new: true })
  

const deleteblog1 = async function(req,res){
        try {  
      let blogId=req.params._id
      if (!blogId) {
        return res.status(404).send("No such blog exists");
      }
      let updatedblog = await BlogModel.findByIdAndUpdate({_id:blogId },{isDeleted:true},{new:true});
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
      //console.log(authorId)
      let tags=req.query.tags
      let subCategory=req.query.subCategory
      // let updatedblog = await BlogModel.find({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]}).updateMany({$set:{isDeleted:true}},{new:true});
      let updatedblog = await BlogModel.findOneAndUpdate({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]},
       {$set:{isDeleted:true,deletedAt:new Date(Date.now())}},{new:true});

      console.log(updatedblog)
      res.status(200).send({ status:true, data: updatedblog });
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

