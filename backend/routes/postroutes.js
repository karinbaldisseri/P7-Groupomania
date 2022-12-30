const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const router = express.Router();

const postControl = require('../controllers/postcontroller');
const likeControl = require('../controllers/likecontroller');


//ROUTES

router.post('/', auth, multer, postControl.createPost);
router.get('/', auth, postControl.getAllPosts);
router.get('/:id', auth, postControl.getOnePost);
router.put('/:id', auth, multer, postControl.modifyPost);
router.delete('/:id', auth, postControl.deletePost);
router.get('/:id/likecount', auth, likeControl.likeCount);
router.post('/:id/like', auth, likeControl.addOrRemoveLike);


// EXPORTS
module.exports = router;