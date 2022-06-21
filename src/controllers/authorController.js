const AuthorModel = require('../models/authorModel')
 
const createAuthor = async function(req,res){
    let data = req.body
    const createData = await AuthorModel.create(data)
    res.status(201).send({msg:createData})
}

module.exports.createAuthor = createAuthor