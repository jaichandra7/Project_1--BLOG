const mongoose = require('mongoose')
const BlogModel = require('../models/blogModel')

const createBlog = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      res.status(400).send({ msg: "cant be empty object" })
    }

    const auth = data.authorId

    if (!auth) {
      res.status(400).send({ status: false, msg: "authorid is required" })
    }

    if (!mongoose.isValidObjectId(auth)) {
      return res.status(400).send({ status: false, msg: "invalid authorId" })
    }
    const createData = await BlogModel.create(data)
    res.status(400).send({ msg: createData })
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}

const getblogs = async function (req, res) {
  try {
    let query = req.query
    console.log(query)
    const getblog = await BlogModel.find({ $and: [{ isPublished: true, isDeleted: false }, query] })

    if (getblog.length === 0) {
      return res.status(404).send({ status: false, msg: "no author found" })
    }
    res.status(200).send({ status: true, data: getblog })

  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

}

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params._id
    let data = req.body
    let tags = data.tags
    let subCategory = data.subCategory
    let title = data.title
    let body = data.body

    if (Object.keys(data).length == 0) {
      res.status(400).send({ msg: "cant be empty object" })
    }

    const checkBlog = await BlogModel.find({ _id: blogId })
    console.log(checkBlog)
    if (checkBlog.length == 0) return res.status(404).send({ status: false, msg: "Blog Not Found" })

    if (checkBlog[0].isDeleted == true) {
      return res.status(400).send({ status: false, msg: "we cannot modify the deleted blog" })
    }
    else {
      const updatedBlog = await BlogModel.findOneAndUpdate({ _id: blogId }, { title: title, body: body, isPublished: true, publishedAt: new Date(Date.now()) }, { new: true },)
      updatedBlog.save()

      if (data.subCategory) {
        updatedBlog.subCategory.push(subCategory)
      }
      else {
        updatedBlog.tags.push(tags)
      }
      res.status(200).send({ msg: true, data: updatedBlog })
    }
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ error: err.message })

  }
}



const deleteblog1 = async function (req, res) {
  try {
    let blogId = req.params._id
    if (!blogId) {
      return res.status(404).send({ msg: "No blogId exists" });
    }
    let updatedblog = await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: new Date() }, { new: true });
    res.status(200).send({ status: true, data: updatedblog });
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}



const deleteblog2 = async function (req, res) {
  try {
    let authIdtoken = req.authorId

    let query = req.query
    let getdata =await BlogModel.find(query,{isDeleted:false})
    if(getdata.length==0){
      return res.status(404).send({status:false,msg:"no blog such blog"})
    }

    if(getdata.isDeleted==true){
      return res.status(400).send({status:false,msg:"we cannot update deleted blog"})
    }

    let updatedBlog = await BlogModel.updateMany({$and:[{authorId:authIdtoken},query]},{$set:{isDeleted:true,deletedAt:new Date()}},{new:true})

    res.status(200).send({ status: true, data: updatedBlog });
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


