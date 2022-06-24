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
    let lname=data.lname
    if(!lname){
        return res.status(400).send({status:false,msg:"Last Name must be present"})
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
    let password=data.password
    if(!password){
        return res.status(400).send({status:false,msg:"password must be present"})
    }
    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let email=data.email
    let emailvalidation= regex.test(email)
    if(!emailvalidation){
        return res.status(400).send({status:false,msg: "enter a valid email id"})
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
