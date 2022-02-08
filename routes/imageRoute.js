const express = require('express');
const router = express.Router();

const ImageCtrl = require('../controllers/image');
const AuthHelper = require('../helpers/authHelper');

router.get(
    '/set-default-image/:imgId/:imgVersion',
    AuthHelper.VerifyToken,
    ImageCtrl.SetDefaultImage
  );
router.post('/upload-image', AuthHelper.VerifyToken, ImageCtrl.UploadImage);


module.exports = router;
 