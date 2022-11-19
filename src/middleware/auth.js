const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const auth = function(req, res, next) {
    try {
      let token = req.headers["x-Api-key"];                  
      if (!token) {                                     
        token = req.headers["x-api-key"];                 
      }
      if (!token) {
        return res.status(401).send({ status: false, msg: "Token must be present" });
      }
      let decodedToken = jwt.verify(token, "MOVIESLIST" )   
      if(!decodedToken){
        return res.status(400).send({status:false, message:"please enter valid token"})
      }   
      else{ 
      req.userId = decodedToken.userId;
      console.log(req.userId);
      next();       
      }                                            
    }
    catch (error) {
      res.status(500).send({ status: false, messageg: error.message });
    }
  }

module.exports = {auth}