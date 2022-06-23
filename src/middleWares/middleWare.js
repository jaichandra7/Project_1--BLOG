const jwt = require('jsonwebtoken')
const BlogModel = require('../models/blogModel')
const authentication = async function(req,res,next){
    try{
        let token = req.headers["x-Api-key"] || req.headers["x-api-key"]; 
        if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
      
      let decodedToken = jwt.verify(token, "Project-1");
      if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid" });
      next()
    }
    catch (err) {
      console.log("This is the error :", err.message)
      res.status(500).send({ msg: "Error", error: err.message })
    }
    };

    const Authorization = async function(req,res,next){
        try{

            let token = req.headers["x-Api-key"] || req.headers["x-api-key"]; 
            let decodedToken = jwt.verify(token, "Project-1");
            let blogId=req.params._id
             let authorId= await BlogModel.findOne({_id:blogId})
             console.log(authorId)
             let auth= authorId.authorId.toString()
            let authorLoggedIn = decodedToken.loginUser

            
            if(auth!= authorLoggedIn) return res.status(403).send({status: false, msg: 'author logged is not allowed to modify the requested authors data'})
            
            }
            catch (err) {
              console.log("This is the error :", err.message)
              res.status(500).send({ msg: "Error", error: err.message })
            }
            next()
            };
            

    

    module.exports.authentication = authentication
    module.exports.Authorization = Authorization

    

