const cloudinary = require('cloudinary')
const HttpStatus = require('http-status-codes')
const User = require('../models/userModels');


cloudinary.config({ 
    cloud_name: 'dfxjpj3c0', 
    api_key: '395987355915277', 
    api_secret: 'U8CRQpMs1LMEanNuk5mYqx8CvGg' 
  });

module.exports = {
    UploadImage(req, res) {
        cloudinary.uploader.upload(req.body.image, async result => {
          await User.update(
            {
              _id: req.user._id
            },
            {
              $push: {
                images: {
                  imgId: result.public_id,
                  imgVersion: result.version
                }
              }
            }
          )
            .then(() =>
              res
                .status(HttpStatus.OK)
                .json({ message: 'Image uploaded successfully' })
            )
            .catch(err =>
              res
                .status(HttpStatus.stausCode.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error uploading image' })
            );
        });
      },
    
      async SetDefaultImage(req, res) {
        const { imgId, imgVersion } = req.params;
    
        await User.update(
          {
            _id: req.user._id
          },
          {
            picId: imgId,
            picVersion: imgVersion
          }
        )
          .then(() =>
            res.status(HttpStatus.OK).json({ message: 'Default image set' })
          )
          .catch(err =>
            res
              .status(HttpStatus.stausCode.INTERNAL_SERVER_ERROR)
              .json({ message: 'Error occured' })
          );
      }






//   async UploadImage(req, res){
//     //   console.log(req.body)
//   await cloudinary.v2.uploader.upload(req.body.image,
//      (error,result)=>{
//          if(error){
//              console.log(error)
//          }
//         console.log(result)
//         User.updateOne(
//             {
//                 _id:req.user._id
//             },
//             {
//                 $push: {
//                     images:{
//                         imgId:result.public_id,
//                         imgVersion:result.version
//                     }
//                 }
//             }
//         ).then(()=>{
//             res
//             .status(HttpStatus.StatusCodes.OK)
//             .json({mssage:'image uploaded successfully'})
            
//         }).catch(error=>{
//             res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({message:error.message})
//         })
//     })

//   } ,
//  async setDefaultImage(req,res){
//       const {imgId, imgVersion} = req.params;
//       await User.updateOne({
//           _id:req.user.id,
//       },{
//           picId:imgId,
//           picVersion:imgVersion 
//       })
//       .then(()=>{
//           res.status(HttpStatus.StatusCodes.OK)
//           .status(HttpStatus.StatusCodes.OK)
//             .json({mssage:' profile image uploaded '})
            
//         }).catch(error=>{
//             res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR)
//             .json({message:error.message})
//         })         
    
//   }
}