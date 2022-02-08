const httpStatus = require('http-status-codes');
const User = require('../models/userModels');

module.exports ={
   async GetAllUsers(req, res){
    // console.log('get user called')
       await User.find({})
       .populate('posts.postId')
       .populate('following.userFollowed')
       .populate('followers.follower')
       .then( result =>{
           res.status(httpStatus.StatusCodes.OK).json({mesage:'All users', result})
       }).catch(err =>{
           res.status(httpStatus.StatusCodes.internalServerError).json({mesage:'Error Occured'})
       })
   } ,
   async GetUser(req, res){
    //    console.log('get user by id called')
    await User.findOne({ _id: req.params.id })
    .populate('posts.postId')
    .populate('following.userFollowed')
    .populate('followers.follower')
    .then( result =>{
        res.status(httpStatus.StatusCodes.OK).json({mesage:'User By Id ', result})
    }).catch(err =>{
        res.status(httpStatus.StatusCodes.internalServerError).json({mesage:'Error Occured while getting data by id'})
    })
} ,
async GetUserByName(req, res){
    await User.findOne({username: req.params.username})
    .populate('posts.postId')
    .populate('following.userFollowed')
    .populate('followers.follower')
    .then( result =>{
        res.status(httpStatus.StatusCodes.OK).json({mesage:'user by username ', result})
    }).catch(err =>{
        res.status(httpStatus.StatusCodes.internalServerError).json({mesage:'Error Occured'})
    })
} 
}