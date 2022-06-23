const jwt = require('jsonwebtoken')
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
            let authorToBeModified = req.params.loginUser
            let authorLoggedIn = decodedToken.loginUser
            
            if(authorToBeModified != authorLoggedIn) return res.status(403).send({status: false, msg: 'author logged is not allowed to modify the requested authors data'})
            
            }
            catch (err) {
              console.log("This is the error :", err.message)
              res.status(500).send({ msg: "Error", error: err.message })
            }
            next()
            };
            

    

    module.exports.authentication = authentication
    module.exports.Authorization = Authorization

    

