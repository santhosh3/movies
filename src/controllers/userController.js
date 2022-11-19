const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');

function isValid(value){
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

async function userCreation(req,res){
    try {
        const body = req.body;
        const {userName,email,password} = body;
        if(Object.keys(body).length == 0){
           return res.status(400).send({status:false, message:"please provide data"});
        }
        if(!isValid(userName)){
            return res.status(400).send({status:false, message:"please provide userName"});   
        }
        if(!isValid(email)){
            return res.status(400).send({status:false, message:"please provide email"});   
        }
        let emailFound = await userModel.findOne({email:email})
        if(emailFound){
            return res.status(400).send({status:false, message:"email is already exists"});
        }
        if(!isValid(password)){
            return res.status(400).send({status:false, message:"please provide password"});   
        }
        let create = await userModel.create(body);
        return res.status(201).send({status:true, message:"user created sucessfully", data:create});
    } catch (error) {
        return res.status(500).send({status:false,message:error.message});
    }
}

async function login(req,res){
    try {
        let body = req.body
        if (Object.keys(body).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide login details" })
        }
        let { email, password } = body
        if(!isValid(email)) {
            return res.status(400).send({status:false, message: "Email is required"})
        }
        if(!isValid(password)) {
            return res.status(400).send({status:false, message: "password is required"})
        }
        let data = await userModel.findOne({ email: email, password: password })
        if (!data) {
            return res.status(400).send({ status: false, message: "Invalid login credentials" })
        }
        else {
            let token = jwt.sign({ 
                    userId: data._id,
                    iat: Math.floor(Date.now()/1000),
                    iat: Math.floor(Date.now()/1000)+60*60*60}, "MOVIESLIST")
                    
            return res.status(200).send({ status: true, message: "User login successful", data: {token} })
        }
    } catch (error) {
      return res.status(500).send({status:false,message:error.message});
    }
}



module.exports = {userCreation,login}