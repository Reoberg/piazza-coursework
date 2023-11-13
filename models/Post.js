const mongoose = require("mongoose");
const {array} = require("joi");

const postSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    category:{
        type:String,
        require: true,
        min: 1,
        max: 32
    },
    info_body:{
        type:String,
        require: true,
        min: 1,
        max: 1024,
    },
    comments:{
        type:Array
    },
    like:{
        type:Number,
        default: 0
    },
    dislike:{
        type:Number,
        default: 0
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports = mongoose.model('posts', postSchema)