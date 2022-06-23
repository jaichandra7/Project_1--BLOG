const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
const createAuthor = async function(req,res){
    try{
    let data = req.body
   // const email =data.email
    //if(!email){
     // res.status(400).send({status:false,msg:"email is required"})
    //}
    let regex = new RegExp("([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'+/-9=?A-Z^-~-]+(\.[!#-'+/-9=?A-Z^-~-]+)|\[[\t -Z^-~]*])");
    let testmails=data.email
    let emailvalidation= regex.test(testmails)
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

const login = async function(req,res){
    try{
    let email = req.body.email
    let password = req.body.password
    var loginUser = await AuthorModel.findOne({email:email,password:password})
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