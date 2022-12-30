const Post = require('../models/post');
const Like = require('../models/like');
const User = require('../models/user');


// Manage Likes and Dislikes
// // CREATE like -> POST
exports.addOrRemoveLike = async (req, res) => {
    Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
            if (!post) {
                res.status(404).json({ error: 'Resource not found' });
            } else {
                // check if user has already liked or disliked this post
                Like.findOne({ where: { postId: req.params.id, userId: req.auth.userId } })
                    .then((likeFound) => {
                        // if user hasn't voted yet and adds a like
                        if (!likeFound && req.body.like === 1) {
                            Like.create({ postId: req.params.id, userId: req.auth.userId, likeValue: 1 })
                                .then(() => res.status(201).json({ message: 'Post: like added !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // + increment likesTotal in the Post
                            post.increment('likesTotal');
                        // if user hasn't voted yet and adds a dislike
                        } else if (!likeFound && req.body.like === -1) {
                            Like.create({ postId: req.params.id, userId: req.auth.userId, likeValue: -1 })
                                .then(() => res.status(201).json({ message: 'Post: dislike added !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // +increment dislikesTotal in the Post
                            post.increment('dislikesTotal');
                        // if user has LIKED and unlikes
                        } else if (/*likeFound &&*/ likeFound.likeValue === 1 && req.body.like === 0) {
                            Like.destroy({ where: { postId: req.params.id, userId: req.auth.userId, likeValue: 1 } })
                                .then(() => res.status(200).json({ message: 'Post unliked !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // + decrement likesTotal in the Post
                            post.decrement('likesTotal');
                        // if user has DISLIKED and undislikes
                        } else if (likeFound.likeValue === -1 && req.body.like === 0) {
                            Like.destroy({ where: { postId: req.params.id, userId: req.auth.userId, likeValue: -1 } })
                                .then(() => res.status(200).json({ message: 'Post undisliked !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // + decrement dislikesTotal in the Post
                            post.decrement('dislikesTotal');
                        // if user has LIKED and changes to dislke
                        } else if (likeFound.likeValue === 1 && req.body.like === -1) {
                            Like.update({ likeValue: -1 }, { where: { postId: req.params.id, userId: req.auth.userId, likeValue: 1 } })
                                .then(() => res.status(200).json({ message: 'Post unliked  AND disliked !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // + decrement likesTotal in the Post
                            post.decrement('likesTotal');
                            // + increment dislikesTotal in the Post
                            post.increment('dislikesTotal');
                        // if user has DISLKIED and changes to like
                        } else if (likeFound.likeValue === -1 && req.body.like === 1) {
                            Like.update({ likeValue: 1 }, { where: { postId: req.params.id, userId: req.auth.userId, likeValue: -1 } })
                                .then(() => res.status(200).json({ message: 'Post undisliked  AND liked !' }))
                                .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            // + increment likesTotal in the Post
                            post.increment('likesTotal');
                            // + decrement dislikesTotal in the Post
                            post.decrement('dislikesTotal');
                        } else {
                            return res.status(400).json({ message: 'Bad request' });
                        }
                    })
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' }));
};

// READ - Get likes & dislikes Totals -> GET
exports.likeCount = async (req, res) => {
    try {
        const likesTotal = await Like.count({
            where: { postId: req.params.id, likeValue: 1 },
            include: [{ model: User, required: true, where: { isActive: true } }]
        });

        const dislikesTotal = await Like.count({
            where: { postId: req.params.id, likeValue: -1 },
            include: [{ model: User, required: true, where: { isActive: true } }]
        });

        res.status(200).json({
            likesTotal,
            dislikesTotal
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' })
    }
 };

