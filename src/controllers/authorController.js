const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')

//----------------------------------------------------------CREATE AUTHOR-----------------------------------------------------------------//

const createAuthor = async function(req,res){
    try{
        let data = req.body
    if ( Object.keys(data).length == 0) {
        res.status(400).send({status:false,msg: "input field cannot be empty" })
       }

    let fname=data.fname

    if(!fname){
        return res.status(400).send({status:false,msg:"First Name must be present"})
    }
    if(typeof fname!="string"){
        return res.status(400).send({status:false,msg:" first name must be in string only"})
    }
    let firstname = fname.trim()
    if (firstname.length ==0){
        return res.status(400).send({status:false,msg:" first name must have atleast one character"})
    }
    let lname=data.lname
    if(!lname){
        return res.status(400).send({status:false,msg:"Last Name must be present"})
    }
    if(typeof lname!="string"){
        return res.status(400).send({status:false,msg:" last name must be in string only"})
    }
    let lastname = lname.trim()
    if (lastname.length ==0){
        return res.status(400).send({status:false,msg:"last name must have atleast one character"})
    }

    let title=data.title
    if(!title){
        return res.status(400).send({status:false,msg:"title should be present"})
    }
    const Enum = ["mr","mrs","miss"]
    let includes=title
    let enums=Enum.includes(includes)
    if(!enums){
        return res.status(400).send({status:false,msg:"title should have mr mrs miss"})
    }

    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let email=data.email
    let emailvalidation= regex.test(email)
    if(!emailvalidation){
        return res.status(400).send({status:false,msg: "enter a valid email id"})
    }
    let emailpresent = await AuthorModel.find({email:email})
    if(emailpresent.length>0 && email===emailpresent[0].email){
        return res.status(400).send({status:false,msg:"email already registered"})
    }
    
    let password=data.password
    if(!password){
        return res.status(400).send({status:false,msg:"password must be present"})
    }

    const createData = await AuthorModel.create(data)
    res.status(201).send({msg:createData})
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
        res.status(400).send({status:false, msg: "input field cannot be empty" })
       }

    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let email = data.email
    let emailvalidation= regex.test(email)
    if(!emailvalidation){
        return res.status(400).send({status:false,msg: "enter a valid email id"})
    }

    let password = data.password
    if(!password){
        return res.status(400).send({status:false,msg:"password must be present"})
    }

    var loginUser = await AuthorModel.findOne({email:email,password:password})
    console.log(loginUser)
    if(!loginUser){
        res.status(400).send({status:false,msg:"login Credentials are wrong"})
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
        res.status(201).send({status:true,msg:token})

  }


  
module.exports.createAuthor = createAuthor
module.exports.login = login
