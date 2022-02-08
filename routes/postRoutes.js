const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/post');
const authHelper = require('../helpers/authHelper');

router.get('/posts', authHelper.VerifyToken, PostCtrl.getAllPosts);
router.get('/post/:id', authHelper.VerifyToken, PostCtrl.getPost);

router.post('/post/add-post', authHelper.VerifyToken, PostCtrl.AddPost);
router.post('/post/add-like', authHelper.VerifyToken, PostCtrl.addLike);
router.post('/post/add-comment', authHelper.VerifyToken, PostCtrl.addComment);

module.exports = router;