const Joi =require('joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = require('../models/userModels');
const Helpers = require('../helpers/helper');
const dbConfig = require('../config/secret');
module.exports = {
  async  createUser(req,res){
        // console.log(req.body)
        const schema = Joi.object({
            username: Joi.string()
            .min(5)
            .max(10)
            .required(),
            email: Joi.string().email().required(),
            password: Joi.string()
            .min(5)
            .required()
        });
        const {error, value } = schema.validate(req.body);
        // console.log(value)
        if(error && error.details){
            return res
            .status(HttpStatus.StatusCodes.BAD_REQUEST)
            .json({msg:error.details})
        } 
        const userEmail = await User.findOne({email:Helpers.lowerCase(req.body.email)});
        if(userEmail){
            return res
            .status(HttpStatus.StatusCodes.CONFLICT)
            .json({message:'Email alrerady Exist'});
        }
        const userName = await User.findOne({username:Helpers.firstUpper(req.body.username)})
        if(userName){
            return res
            .status(HttpStatus.StatusCodes.CONFLICT)
            .json({message:'username already exist'})
        }
        return bcrypt.hash(value.password, 10,(error,hash)=>{
            if(error){
                return res
                .status(HttpStatus.StatusCodes.BAD_REQUEST)
                .json({message:'Error hashing password'})
            }
            const body ={
                username:Helpers.firstUpper(value.username),
                email:Helpers.lowerCase(value.email),
                password:hash
            };
            User.create(body)
            .then(user =>{
                const token = jwt.sign({data:user},dbConfig.secret, {
                    expiresIn:"1hr"
                })
                res.cookie('auth', token );
                res
                .status(HttpStatus.StatusCodes.CREATED)
                .json({message:'User crested successfully',user, token});
            })
            .catch(err =>{
                res
                .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({message:'Error occured'});
            })

        })
    },
   async loginUser(req, res){
        if (!req.body.username || ! req.body.password){
            return res.status(HttpStatus.StatusCodes.NOT_FOUND)
            .json({message:"No empty fields allowed"})
        }
        await User.findOne({
            username:Helpers.firstUpper(req.body.username)
        }).then(user =>{
            if(!user){
                return res.status(HttpStatus.StatusCodes.NOT_FOUND)
                .json({message:'username not found'});
            }
            return bcrypt.compare(req.body.password,user.password).then(result=>{
                 if(!result){
                     return res.status(HttpStatus.StatusCodes.NOT_FOUND)
                    .json({message:"password is incorrect"})
                 }
                 const token =jwt.sign({data:user},dbConfig.secret, {
                     expiresIn:"5hr"
                 });
                 res.cookie('auth',token);
                 return res.status(HttpStatus.StatusCodes.OK)
                 .json({message:'login successfull',user,token});
            })
        })
        .catch(err=>{
            return res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message:'Error Occured'})
        })
    }
}