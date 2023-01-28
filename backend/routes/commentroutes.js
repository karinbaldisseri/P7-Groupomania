const express = require('express');
const auth = require('../middlewares/auth');
const router = express.Router();

const commentControl = require('../controllers/commentcontroller');


//ROUTES

router.post('/:postId/comments', auth, commentControl.createComment);
router.get('/:postId/comments', auth, commentControl.getAllCommentsByPost);
router.get('/:postId/commentscount', auth, commentControl.commentsCount);
//router.get('/:id', auth, commentControl.getOneComment);
router.put('/:postId/comments/:id', auth, commentControl.modifyComment);
router.delete('/:postId/comments/:id', auth, commentControl.deleteComment);

// EXPORTS
module.exports = router;