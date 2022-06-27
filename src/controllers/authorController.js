const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')

//----------------------------------------------------------CREATE AUTHOR-----------------------------------------------------------------//

const createAuthor = async function(req,res){
    try{
        let data = req.body
    if ( Object.keys(data).length == 0) {         
        res.status(400).send({status:false,msg: "input field cannot be empty" }) //request body should not be empty validation.
       }

    let fname=data.fname

    if(!fname){
        return res.status(400).send({status:false,msg:"First Name must be present"})   // fname key should be present in data.
    }
    if(typeof fname!="string"){
        return res.status(400).send({status:false,msg:" first name must be in string only"})  //fname key value should be in string only validation. 
    }
    let firstname = fname.trim()
    if (firstname.length ==0){
        return res.status(400).send({status:false,msg:" first name must have atleast one character"}) //fname value should have one character atleast and extra spaces around value is trimmed.
    }
    let lname=data.lname
    if(!lname){
        return res.status(400).send({status:false,msg:"Last Name must be present"})  // lname key should be present in data.
    }
    if(typeof lname!="string"){
        return res.status(400).send({status:false,msg:" last name must be in string only"}) //lname key value should be in string only validation. 
    }
    let lastname = lname.trim()
    if (lastname.length ==0){
        return res.status(400).send({status:false,msg:"last name must have atleast one character"}) //lname value should have one character atleast and extra spaces around value is trimmed.
    }

    let title=data.title
    if(!title){
        return res.status(400).send({status:false,msg:"title should be present"})  // title key should be present in data.
    }
    const Enum = ["mr","mrs","miss"]
    let includes=title
    let enums=Enum.includes(includes)
    if(!enums){
        return res.status(400).send({status:false,msg:"title should have mr mrs miss"})  // validation for fixed enums.
    }

    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let email=data.email
    let emailvalidation= regex.test(email)
    if(!emailvalidation){
        return res.status(400).send({status:false,msg: "enter a valid email id"}) // email id validation with @ and some fixed length of character.
    }
    let emailpresent = await AuthorModel.find({email:email})
    if(emailpresent.length>0 && email===emailpresent[0].email){
        return res.status(400).send({status:false,msg:"email already registered"}) // email id validation for verifying that email is not repeated.
    }
    
    let password=data.password
    if(!password){
        return res.status(400).send({status:false,msg:"password must be present"}) //password key should be present in data
    }

    const createData = await AuthorModel.create(data)
    res.status(201).send({status:true,data:createData})
}
catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
}
}

// -------------------------------------------------------------LOGIN AUTHOR----------------------------------------------------------------//

const login = async function(req,res){
    try{
    let data=req.body

    if ( Object.keys(data).length == 0) {
        res.status(400).send({status:false, msg: "input field cannot be empty" }) //request body should not be empty validation.
       }

    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let email = data.email
    let emailvalidation= regex.test(email)
    if(!emailvalidation){
        return res.status(400).send({status:false,msg: "enter a valid email id"}) // email id validation with @ and some fixed length of character.
    }

    let password = data.password
    if(!password){
        return res.status(400).send({status:false,msg:"password must be present"}) //password key should be present in data
    }

    var loginUser = await AuthorModel.findOne({email:email,password:password})
    console.log(loginUser)
    if(!loginUser){
        res.status(400).send({status:false,msg:"login Credentials are wrong"}) //login email and password does not match validation.
    }
}
catch (err) {
    console.log("This is the error :", err.message)
    res.status(500).send({ msg: "Error", error: err.message })
}

    let token = jwt.sign(
        {
            loginUser:loginUser._id.toString(),
            batch:"radon",
            organisation:"functionUp"
        },"Project-1"
        )
        res.setHeader("x-api-key",token)
        res.status(201).send({status:true,msg:token}) //creating jwt after successful login by author

  }


  
module.exports.createAuthor = createAuthor
module.exports.login = login
