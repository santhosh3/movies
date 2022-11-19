const movieModel = require('../models/movieModel');
const mongoose = require('mongoose');

async function movies(req,res){
  try{
    let body = req.body;
    let {movieName,description,genrec,year} = body;
    if(Object.keys(body).length == 0){
       return res.status(400).send({status:false, message:"please provide data"});
    }
    let create = await movieModel.create(body);
    return res.status(201).send({status:true, message:"creates successfully", data:create});
  }catch(error){
    return res.status(500).send({status:false,message:error.message});
  }
}

module.exports = {movies}