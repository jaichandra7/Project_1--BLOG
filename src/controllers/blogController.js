const BlogModel = require('../models/blogModel')

const createBlog = async function(req,res){
    let data = req.body
    const auth = data.authorId
    if(!auth){
        res.status(400).send({status:false, msg:"author is required"})
    }
    const createData = await BlogModel.create(data)
}


module.exports.createBlog = createBlog
