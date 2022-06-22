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
      let updatedblog = await BlogModel.findOneAndUpdate({$or:[{authorId:authorId},{category:category},{tags:tags},{subCategory:subCategory}] },{$set:{isDeleted:true}},{new:true});
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
