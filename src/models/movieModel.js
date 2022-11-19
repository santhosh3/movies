const mongoose = require("mongoose")

const movieSchema = new mongoose.Schema({

    movieName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true, 
        required: true,  
    },
    genrec: {
        type: String,
        trim: true,
        required: true
    },
    year:{
        type: Number,
        trim: true,
        required: true
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    deletedAt: { 
        type: Date, 
        default: null 
    }

} , {timestamps : true})

module.exports = mongoose.model("movies" , movieSchema)