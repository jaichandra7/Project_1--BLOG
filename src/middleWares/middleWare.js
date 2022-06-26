const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const BlogModel = require('../models/blogModel')


//-------------------------------------------------AUTHENTICATION----------------------------------------------------------------------//

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];   //request token from headers with key name x-api-key
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });   //if token is not present in headers

    let decodedToken = jwt.verify(token, "Project-1");     //decoding token and comparing with secret to verify author
    if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });
    next()
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }
};

//----------------------------------------------------AUTHORIZATION-----------------------------------------------------------------------//

const Authorization = async function (req, res, next) {
  try {

    let token = req.headers["x-Api-key"] || req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "Project-1");
    let authorLoggedIn = decodedToken.loginUser   // accessing authorid from payload of token 
    req.authorId = authorLoggedIn   //taking  re.authorid variable to use further in controller for updating flag
    console.log(req.authorId)
    let blogId = req.params._id   //blogid from path params 

    if (blogId) {                 // if condition is only valid for updating and deleting via path params
      if(!mongoose.isValidObjectId(blogId)){
        return res.status(400).send({status:false,msg:'invalid blogId '})  //blogId length validation according to mongoose.
      }
      let findAuthInBlog = await BlogModel.findOne({ _id: blogId })
      let author =findAuthInBlog.authorId.toString()
      console.log(author)
      // console.log(authorLoggedIn)
      if (author != authorLoggedIn) return res.status(403).send({ status: false, msg: 'author logged is not allowed to modify the requested authors data' })
    }
    next()
  }
  catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
  }

};





module.exports.authentication = authentication
module.exports.Authorization = Authorization



