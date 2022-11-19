const mongoose= require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId
const watchListSchema = new mongoose.Schema(
    {
        userId: {type:ObjectId, ref:"user", required:true, unique:true},
        movieList: [
           {type:String},
        ],
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date, default: null }
      },{timestamps:true}
)
module.exports = mongoose.model("watchList",watchListSchema)