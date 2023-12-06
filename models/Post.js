const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    username:{
        type:String,
        require: true,
        min:3,
        max:256
    },
    title:{
        type:String,
        require: true,
        min: 1,
        max: 32
    },
    categories:{
        type:String,
        enum:["Politics","Health","Sports","Tech"],
        require: true,

    },
    message_body:{
        type:String,
        require: true,
        min: 1,
        max: 1024,
    },
    comments:{
        type: [{
            comment_owner:{
                type: String,
                required: true,
                min: 3,
                max: 256
            },
            comment_body:{
                type: String,
                required: true,
                min: 1,
                max: 1024
            }
        }],
        default: []
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
    },
    expirationTime:{
        type:Date,
        default:
        function () {
           // return new Date(Date.now() + 86400000); // 86400000 milliseconds in a day
            return new Date(Date.now() + 360000);
        }
    },
    isLive:{
        type: Boolean,
        default: true
    }


})

postSchema.methods.checkAndUpdateIsLive = function () {
    if (this.expirationTime && this.expirationTime < new Date()) {
        this.isLive = false;
    }
};


module.exports = mongoose.model('posts', postSchema)