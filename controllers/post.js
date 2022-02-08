const Joi = require('joi')
const HttpStatus = require('http-status-codes');

const Post = require('../models/postModels'); 
const User = require('../models/userModels');

module.exports={
    AddPost(req, res){
        // console.log(req.cookies);
        // console.log(req);
        const schema = Joi.object({
            post:Joi.string().required()
        });
        const {error, value }= schema.validate(req.body);
        // console.log(value)
        if(error && error.details) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST)
            .json({msg: error.details});
        }
        const body = {
            user: req.user._id,
            username: req.user.username,
            post:value.post,
            created: new Date()
        };
        Post.create(body)
        .then( async post=>{
            await User.update(
                {
                    _id: req.user._id
                },{
                    $push:{
                        posts:{
                            postId:post._id,
                            post: post.post,
                            created : new Date() 
                        }
                    }
                }
            );
            
            res.status(HttpStatus.StatusCodes.OK)
            .json({message: 'post created', post})
        })
        .catch(err =>{
            res .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message:' Error occured  '})
        })

    },
    async getAllPosts(req, res){
        try{
            const posts= await Post.find({})
            .populate('user')
            .sort({created: -1 });
            return res.status(HttpStatus.StatusCodes.OK)
            .json({ message: 'All posts', posts})
        }
        catch ( err){
            return res
            .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured'})
        }
    },
    // async addLike(req, res) {
    //     const postId = req.body._id;
    //     await Post.update({
    //         _id:postId,
    //         'likes.username': { $ne: req.user.username}
    //     },{
    //         $push:{
    //             likes:{
    //                 username:req.user.username
    //             }
    //         },
    //         $inc:{
    //             totalLikes:1
    //         }
    //     })
    //     .then(()=>{
    //         res.status(HttpStatus.StatusCodes.ok).json({message:'you liked the post'});
    //     })
    //     .catch(err =>{
    //         res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Occured'})
    //     })
    // },
    async addLike(req, res) {
        const postId = req.body._id;
        await Post.update(
          {
            _id: postId,
            'likes.username': { $ne: req.user.username }
          },
          {
            $push: {
              likes: {
                username: req.user.username
              }
            },
            $inc: { totalLikes: 1 }
          }
        )
          .then(() => {
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'You liked the post' });
          })
          .catch(err =>
            res
              .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' })
          );
      },
    // async addComment(req, res){
    //     const postId = req.body.postId;
    //     // console.log(req)
    //     await Post.update(
    //         {
    //             _id: postId
    //         },
    //         {
    //         $push:{
    //             comments:{
    //                 userId: req.user._id,
    //                 username: req.user.username,
    //                 comment:req.body.comment,
    //                 createdAt: new Date()
    //                 }
    //         }
    //     })
    //     .then(()=>{
            
    //         res.status(HttpStatus.StatusCodes.ok).json({message:'you commented the post'});
    //     })
    //     .catch(err =>{
    //         res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({message:'Error Occured'})
    //     })
    // }
    async addComment(req, res) {
        const postId = req.body.postId;
        await Post.update(
          {
            _id: postId
          },
          {
            $push: {
              comments: {
                userId: req.user._id,
                username: req.user.username,
                comment: req.body.comment,
                createdAt: new Date()
              }
            }
          }
        )
          .then(() => {
            res.status(HttpStatus.StatusCodes.OK).json({ message: 'Comment added to post' });
          })
          .catch(err =>
            res
              .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' })
          );
      },
      async getPost(req, res){
        await Post.findById({_id: req.params.id})
        .populate('user')
        .populate('comments.userId')
        .then((post)=>{
          res.status(HttpStatus.StatusCodes.OK).json({message:'post found', post });
        })
        .catch(err => res.status(HttpStatus.StatusCodes.NOT_FOUND).json({message:'post not found', post}))
      }
    
}