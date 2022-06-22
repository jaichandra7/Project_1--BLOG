const AuthorModel = require('../models/authorModel')
 
const createAuthor = async function(req,res){
    try{
    let data = req.body
    // const email =data.email
    // if(email !="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"){
    //     res.status(400).send({status:false,msg:"not a valid email"})
    //   }
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
module.exports.createAuthor = createAuthor