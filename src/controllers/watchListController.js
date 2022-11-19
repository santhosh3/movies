const watchListModel = require('../models/watchListModel');
const movieModel = require('../models/movieModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

function isValid(value){
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

async function watchList(req,res){
    try {
        let userId = req.params.userId;
        let body = req.body;
        if (Object.keys(body) == 0) { 
            return res.status(400).send({status:false,message:"No data provided"})
        }
        // userId validation
        if(!userId){
            return res.status(400).send({status:false, message:"please provide params"});
        }
        let findUser = await userModel.findById(userId);
        if(!findUser){
            return res.status(400).send({status:false, message:"userId Not found"});
        }
        if(!isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"please provide valid userId"});
        }
        if(userId !== req.userId){
            return res.status(400).send({status:false, message:"Not authorised"});
        }

        const {movieId, watchListId} = body;
        // movieId validation
        if (!isValid(movieId)) {
             return res.status(400).send({status: false, message: "enter the movieId"});
        }
        if (!isValidObjectId(movieId)) {
             return res.status(400).send({status: false, message: "enter a valid movieId"});
        }
        const movie = await movieModel.findById(movieId);
        if (!movie) {
        return res.status(404).send({ status: false, message: "movie not found" });
        }

        if(!watchListId){
            //checking watchListId present or not if not
            const watch = await watchListModel.findOne({userId: userId});
            if (watch) {
               return res.status(404).send({ status: false, message: "userId already exist" });
            }
            newList = {
                userId: userId,
                movieList: [movieId]
            };
            newList = await watchListModel.create(newList);
            return res.status(201).send({ status: true, message: "movie is added successfully in watchList", data: newList });
        }
        if(watchListId){
        if (!isValidObjectId(watchListId)) {
            return res.status(400).send({ status: false, message: "enter a valid watchListId" });
        }    
        const AlreadyPresent = await watchListModel.findOne({ _id: watchListId, userId: userId });
        if (!AlreadyPresent) {
            return res.status(400).send({ status: false, message: "watchId does not exist" });
        }
       
        let watchList = await watchListModel.findById(watchListId)
        if(watchList.movieList.includes(movieId)){
           return res.status(400).send({status:false, message: "this movie is already present in watchList"})
        } 
        let data = await watchListModel.findOneAndUpdate({_id:watchListId},{$push:{movieList:movieId}},{new:true});
        return res.status(200).send({status:false, message:"movie is added successfully in watchList", data:data})
        
    }
        
  } catch (error) {
      return res.status(500).send({status:false,message:error.message});
    }
}

async function getWatchListData(req,res){
    try {
        //getting user from params
        const userId = req.params.userId;
        if(!isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"Not valid userId"});
        }
        //finding weather user present in DB or not
        const find = await userModel.findById(userId);
        if(!find){
            return res.status(400).send({status:false, message:"user Not found"});
        }
        //Authorising wheather correct user loged in or not
        if(userId !== req.userId){
            return res.status(400).send({status:false, message:"Not authorised"});
        }
        //checking weather is present in watchList collection or not
        let userInWatchList = await watchListModel.findOne({userId:userId}).populate('userId')
        if(!userInWatchList){
            return res.status(400).send({status:false, message:"No watchList is present for user"})
        }
        //created a object for getting data from the user and watchList
        let obj = {
            userId : await userModel.findById(userId),
            movieList : []
        }
    
        for(let elements of userInWatchList.movieList){
            let movies = await movieModel.findById(elements)
            obj.movieList.push(movies)
        }
        return res.status(200).send({status:true, message:"WatchList Data for user", data:obj})
        
    } catch (error) {
      return res.status(500).send({status:false,message:error.message});
    }
}

async function updateWatchListMovies(req,res){
  try {
    //for remove movieList for the user
    let userId = req.params.userId;
    let body = req.body;
    if(!isValidObjectId(userId)){
        return res.status(400).send({status:false, message:"please provide valid userId"});
    }
    //Authorisation
    if(userId !== req.userId){
        return res.status(400).send({status:false, message:"Not authorised"});
    }
    //finding weather user having watchList or not
    let findWatchList = await watchListModel.findOne({userId:userId});
    if(!findWatchList){
        return res.status(400).send({status:false, message:"user Not found"});
    }
    const {movieId} = body;
    //checking weather movieId is present or not
    if (!isValid(movieId)) {
        return res.status(400).send({status: false, message: "enter the movieId"});
    }
    //checking weather movie is present or not in DataBase
    const movie = await movieModel.findById(movieId);
    if(movie == null){
        return res.status.status(400).send({status:false, message: "movie not found"})
    }
    //checking weather movie present in watchList collection or not
    if(!findWatchList.movieList.includes(movieId)){
        return res.status(400).send({status:false, message:"movie is not present in watchList"})
    }
    //updating the dataBase
    let data = await watchListModel.findOneAndUpdate({_id:findWatchList._id},{$pull:{movieList:movieId}},{new:true});
    return res.status(200).send({status:false, message:"movie removed successfully from watchList", data:data})

  } catch (error) {
    return res.status(500).send({status:false,message:error.message});
  }
}

module.exports = {watchList,getWatchListData,updateWatchListMovies}