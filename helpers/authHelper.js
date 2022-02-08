const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');

const dbconfig = require('../config/secret');
 

module.exports = {
    VerifyToken: (req, res, next) =>{
        // console.log('autho' ,req.headers.authorization)
        if(!req.headers.authorization){
            return res
            .status(HttpStatus.StatusCodes.UNAUTHORIZED)
            .json({ message : 'No Authorization'});
        }
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1] ;
        
        if(!token){
            return res
            .status(HttpStatus.StatusCodes.FORBIDDEN)
            .json({message: 'No token provided'});
        }
        return jwt.verify(token, dbconfig.secret, (err, decoded)=>{
            if(err){
                if(err.expiredAt < new Date()){
                    return res
                    .status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({
                        message:'Token has expired, Please login again',
                        token:null
                    });
                }
                next();
            }
            req.user = decoded.data;
            next() 
        });
    }
}