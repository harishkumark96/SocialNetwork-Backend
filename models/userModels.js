const mongoose = require('mongoose');

const userSchema =mongoose.Schema({
    username: {type: String},
    email: { type: String},
    password : { type:String}, 
    posts: [
        {
            postId:{ type:mongoose.Schema.Types.ObjectId, ref: 'Post'},
            post: { type: String },
            created : { type: Date, default: Date.now()}
        }
    ],
    following:[
        { userFollowed: { type: mongoose.Schema.Types.ObjectId, ref:'User'}}
    ],
    followers:[
        { follower: {type: mongoose.Schema.Types.ObjectId, ref:'User'}}
    ],
    notifications:[
        {
            senderId:{ type: mongoose.Schema.Types.ObjectId, ref:'User'},
            message: {type: String},
            viewProfile : { type: Boolean, default: false },
            created: { type: Date, deafut : Date.now() },
            read: { type: Boolean, default: false},
            date: { type: String, default: ''}
        }
    ],
    picVersion:
    {
        type:String,default: '1640184041'
    },
    picId: 
    { 
        type:String, default:'sample.jpg'
    },
    images:[
        {
            imgId:{type: String, default: ''},
            imgVersion:{ type:String, default:''}
        }
    ]

});

module.exports = mongoose.model('User', userSchema); 