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
    // let authorId=req.query.authorId
    // let category=req.query.category
    // let tags=req.query.tags
    // let subCategory=req.query.subCategory
    // filterdata.authorId=authorId
    //     filterdata.category=category
    //     filterdata.tags=tags
    //     filterdata.subCategory=subCategory
    //     console.log(filterdata)
    // const getblog = await BlogModel.find(filterdata)
    // const filterblog = await BlogModel.find({$and:[{filterdata},{$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]}]})
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
      return res.status(404).send({ status: false, msg: "we cannot modify the deleted blog" })
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
    let updatedblog = await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: Date.now() }, { new: true });
    res.status(200).send({ status: true, data: updatedblog });
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}
const deleteblog2 = async function (req, res) {
  try {
    if (req.query.authorId != req.authorId) {
      return res.status(403).send({ msg: "unauth" })
    }
    let authorId = req.query.authorId || req.authorId

    console.log(authorId)
    let authIdtoken = req.authorId
    let category = req.query.category
    let tag = req.query.tag
    let subCategory = req.query.subCategory
    let updatedBlog = await BlogModel.updateMany({ $and: [{ authorId: authorId }, { category: category }, { tags: tag }, { subCategory: subCategory }] }, { $set: { isDeleted: false, deletedAt: Date.now() } }, { new: true });
    // let updatedblog = await BlogModel.findOneAndUpdate({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}]},
    //  {$set:{isDeleted:true,deletedAt:new Date(Date.now())}},{new:true});
    res.status(200).send({ status: true, data: updatedBlog });
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
}

const deleteblog3 = async (req, res) => {
  try {
    let data = req.query
    if (Object.keys(data).length <= 0) return res.status(404).send({ status: false, msg: "please enter filter for deletion" })
    let query = {
      isDeleted: false,
      authorId: req.authorId
    }
    if (data.tags) {
      data.tags = { $in: data.tags.split(',') }
    }
    if (data.subcategory) {
      data.subcategory = { $in: data.subcategory.split(',') }
    }
    query['$or'] = [
      { title: data.title },
      { isPublished: data.isPublished },
      { authorId: data.authorId },
      { category: data.category },
      { subCategory: data.subcategory },
      { tags: data.tags }
    ]
    let del = await BlogModel.find(query)
    if (del.length == 0) {
      return res.status(404).send({ status: false, msg: "No such blog present" })
    }
    const result = await BlogModel.updateMany(
      query, { $set: { isDeleted: true, DeletedAt: new Date().toLocaleString() } })
    res.status(200).send({ status: true, msg: "blogs deleted" })
  }
  catch (err) {
    res.status(500).send({ status: false, data: err.message })
  }
}








module.exports.createBlog = createBlog
module.exports.deleteblog1 = deleteblog1
module.exports.deleteblog2 = deleteblog2
module.exports.getblogs = getblogs
module.exports.updateBlog = updateBlog
module.exports.deleteblog3 = deleteblog3

