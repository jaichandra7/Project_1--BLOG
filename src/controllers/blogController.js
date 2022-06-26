const mongoose = require('mongoose')
const BlogModel = require('../models/blogModel')


// ---------------------------------------------CREATE BLOG API ---------------------------------------------------------------------------//


const createBlog = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      res.status(400).send({ msg: "cant be empty object" })  //request body should not be empty validation.
    }
    let title=data.title
    if(!title){
    return res.status(400).send({status:false,msg:"title must be present"}) // title key should be present in data.
   }
    if(typeof title!="string"){
    return res.status(400).send({status:false,msg:"title must be in string only"}) //title should be in string only.
   }
   let titles = title.trim()
   if (titles.length ==0){
    return res.status(400).send({status:false,msg:" title must have atleast one character"})  //title value should have one character atleast and extra spaces around value is trimmed.
    }
    let body=data.body
    if(!body){
    return res.status(400).send({status:false,msg:"body must be present"}) // body key should be present in data.
   }
    if(typeof body!="string"){
    return res.status(400).send({status:false,msg:"body must be in string only"}) //body should be in string only.
   }
   let bodys= body.trim()
   if (bodys.length ==0){
    return res.status(400).send({status:false,msg:"body must have atleast one character"}) //body value should have one character atleast and extra spaces around value is trimmed.
    }

    const auth = data.authorId
    if (!auth) {
      res.status(400).send({ status: false, msg: "authorid is required" }) //authorid key validation in data.
    }

    if (!mongoose.isValidObjectId(auth)) {
      return res.status(400).send({ status: false, msg: "invalid authorId" }) //authorid length validation according to mongoose.
    }
    
    let category=data.category
    if(!category){
    return res.status(400).send({status:false,msg:"category must be present"}) // category key should be present in data.
   }
    if(typeof category!="string"){
    return res.status(400).send({status:false,msg:"category must be in string only"}) //category should be in string only.
   }
   let categories = category.trim()
   if (categories.length ==0){
    return res.status(400).send({status:false,msg:"category must have atleast one character"}) //category value should have one character atleast and extra spaces around value is trimmed.
    }
   let tags =data.tags
   if(!tags){
    return res.status(400).send({status:false,msg:"tags must be present"}) // tags key should be present in data.
   }
   if(typeof tags!="object"){
    return res.status(400).send({status:false,msg:"tags must be string in object only"}) //tags key should be in object only.
   }
   let Tags=data.tags
   const results = Tags.map(ele => {
    return ele.trim();
   })
  //  console.log(results)
   for (let i=0;i<Tags.length;i++){
   if (Tags[i]!=results[i])
     return res.status(400).send({status:false,msg:"tags having extra spaces! Provide proper tags"}) // validation if extra spaces around tags is given by frontend.
  }
   if (tags.length ==0){
    return res.status(400).send({status:false,msg:"tags must have atleast one character"}) // tags cannot be empty 
    }

  let subCategory =data.subCategory
  if(!subCategory){
   return res.status(400).send({status:false,msg:"subCategory must be present"}) // subCategory key should be present in data.
  }
  if(typeof subCategory!="object"){
    return res.status(400).send({status:false,msg:"subCategory must be string in object only"}) //subCategory key should be in object only.
   }
   let SubCategory=data.subCategory
   const result = SubCategory.map(ele => {
    return ele.trim();
   })
  //  console.log(result)
   for (let i=0;i<SubCategory.length;i++){
   if (SubCategory[i]!=result[i])
     return res.status(400).send({status:false,msg:"subCategory having extra spaces! Provide proper subCategory"})// validation if extra spaces around subCategory is given by frontend.
  }

    const createData = await BlogModel.create(data)
    res.status(201).send({ status:true,msg: createData })
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}

// ---------------------------------------------------GET BLOG API---------------------------------------------------------------------------//


const getblogs = async function (req, res) {
  try {
    let query = req.query
    console.log(query)
    const getblog = await BlogModel.find({ $and: [{ isPublished: true, isDeleted: false }, query] })

    if (getblog.length === 0) {
      return res.status(404).send({ status: false, msg: "no author found" }) // if we are getting empty array 
    }
    res.status(200).send({ status: true, data: getblog })

  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

}

// ---------------------------------------------------UPDATE BLOG BY PATH PARAMS-------------------------------------------------------------//


const updateBlog = async function (req, res) {
  try {
   
    let blogId = req.params._id
    if(!mongoose.isValidObjectId(blogId)){
      return res.status(400).send({status:false,msg:'invalid blogId '})  //blogId length validation according to mongoose.
    }
    let data = req.body
    let tags = data.tags
    let subCategory = data.subCategory
    let title = data.title
    let body = data.body
    var regex=  new RegExp(/^[a-zA-Z ]{2,10}$/);   // naming validation according to characters and length by regex

    if (Object.keys(data).length == 0) {
      res.status(400).send({status:false, msg: "input field cannot be empty" }) // data cannot be empty in body
    }
    if((data.tags && !tags.match(regex))){
      return res.status(400).send({status:false, msg: "tags should be in valid format"}) 
    }
    if(data.subCategory && !subCategory.match(regex)){
      return res.status(400).send({status:false, msg: "subCategory should be in valid format"})
    }
    if(data.title && !title.match(regex)){
      return res.status(400).send({status:false, msg: "title should be in valid format"})
    }
    if(data.body && !body.match(regex)){
      return res.status(400).send({status:false, msg: "body should be in valid format"})
    }

    const checkBlog = await BlogModel.find({ _id: blogId })
    // console.log(checkBlog)
    if (checkBlog.length == 0) return res.status(404).send({ status: false, msg: "Blog Not Found" }) // if we get empty array

    if (checkBlog[0].isDeleted == true) {
      return res.status(400).send({ status: false, msg: "we cannot modify the deleted blog" }) // validation for deleted blog, modification is not allowed.
    }
    else {
      const updatedBlog = await BlogModel.findOneAndUpdate({ _id: blogId }, { title: title, body: body, isPublished: true, publishedAt: new Date()},{ new: true },)
      if (data.subCategory){
        updatedBlog.subCategory.push(subCategory)
      }
      if (data.tags){
        updatedBlog.tags.push(tags)
      }
      updatedBlog.save()          // update in db after pushing the tags and subCategory, because we are using push out of db query.
      res.status(200).send({ msg: true, data: updatedBlog })
    
    }
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ error: err.message })

  }
}



// -----------------------------------------------DELETE BLOG BY PATH PARAMS----------------------------------------------------------------//


const deleteblog1 = async function (req, res) {
  try {
    let blogId = req.params._id
    if(!mongoose.isValidObjectId(blogId)){
      return res.status(400).send({status:false,msg:'invalid blogId '}) //blogId length validation according to mongoose.
    }

    let updatedblog = await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() }, { new: true });
    res.status(200).send({ status:true, data: updatedblog });

  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}



// ---------------------------------------------DELETE BLOG BY QUERY PARAMS-----------------------------------------------------------------//


const deleteblog2 = async function (req, res) {
  try {
    let authIdtoken = req.authorId
    let query = req.query
    let getdata =await BlogModel.find(query,{isDeleted:false}) //first filter conditions according to query and flag
    if(getdata.length==0){
      return res.status(404).send({status:false,msg:"no such blog exist"}) // if no such conditions much validation for empty array
    }

    if(getdata.isDeleted==true){
      return res.status(400).send({status:false,msg:"we cannot update deleted blog"}) // if conditions mach and blog deleted,validation.
    }

    let updatedBlog = await BlogModel.updateMany({$and:[{authorId:authIdtoken},query]},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})

    res.status(200).send({ status: true, data: updatedBlog,msg:"blog deleted"});
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}





module.exports.createBlog = createBlog
module.exports.deleteblog1 = deleteblog1
module.exports.deleteblog2 = deleteblog2
module.exports.getblogs = getblogs
module.exports.updateBlog = updateBlog


