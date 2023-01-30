const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');


// CREATE new post -> POST
exports.createPost = (req, res) => {
    const postData = req.file ? {
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        content: req.body.content
    } : { userId: req.auth.userId, content: req.body.content };
    if (postData) {
        Post.create({ ...postData })
            .then((createdPost) => {
                Post.findOne({
                    where: { id: createdPost.id },
                    include: [{ model: User, required: true, attributes: ['id', 'firstname', 'lastname', 'username'] }],
                })
                    .then((newPost) => res.status(201).json(newPost))
                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
            })
            .catch(() => res.status(500).json({ error: 'Internal server error' }));
    } else {
        return res.status(401).json({ error: 'Client input error or unauthorized request' })
    }
};

// READ - Get single post -> GET
exports.getOnePost = (req, res) => {
    Post.findOne({
        where: { id: req.params.id, userId: req.auth.userId },
        include: [{ association: 'user', attributes: ['id', 'firstname', 'lastname', 'username', 'isActive'] }]
    }) 
        .then((post) => {   
            if (!post) {
                return res.status(404).json({ error: 'Resource not found' })
            } else if (post.user.isActive === false) {
                return res.status(403).json({ error: 'Resource deactivated ! Please contact your admin.' })
            } else {
                res.status(200).json(post)
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' })
        );
};

// READ - Get all posts -> GET
exports.getAllPosts = (req, res) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (!limit || !Number.isFinite(limit) || limit <= 0 || limit > 50) {
        limit = 6;
    }
    if (!page || !Number.isFinite(page) || page <= 0) {
        page = 1;
    }
        
    Post.findAndCountAll({
        include: [{ model: User, required: true, where: { isActive: true }, attributes: ['id', 'firstname', 'lastname', 'username'] }],
        // to be able to use/ get virtual field 'username' (included in query), you have to add the attributes related to it (firstname + lastname)
        order: [['createdAt', 'DESC']],
        limit : limit,
        offset: ((page - 1) * limit)
    })
        .then((posts) => {
            if (!posts) {
                return res.status(404).json({ error: 'Resource not found' });
            } else {
                if (posts.rows && posts.rows.length > 0) {
                    const totalPages = Math.ceil(posts.count / limit)
                    return res.status(200).json({
                        totalCount: posts.count,
                        itemsCount: posts.rows.length,
                        totalPages,
                        nextPage: page < totalPages ? page + 1 : null,
                        previousPage: page > 1 ? page - 1 : null,
                        items: posts.rows
                    })
                } else {
                    // in case comments.count=0 comments.rows=[] (sinon tourne dans le vide)
                    return res.status(200).json({ message : 'Postboard is empty' });
                } 
            } 
        }) 
        .catch(() => res.status(500).json({ error : 'Internal server error' }));
}

// UPDATE Post -> PUT
exports.modifyPost = (req, res) => {
     // Check if image file in request , then if currentImage (if yes means to delete it)
    const postData = req.file ? {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        content: req.body.content
    } : req.body.currentImage ? { content: req.body.content, imageUrl: null } : { content: req.body.content };
    console.log("POSTDATA");
    console.log(postData);
    Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
            if (!post) {
                res.status(404).json({ error: 'Resource not found' });
            } else {
                if (post.userId === req.auth.userId || req.auth.isAdmin) {
                    if (postData) {
                        // If image to update - delete old image file
                        if (postData.imageUrl && post.imageUrl || req.body.currentImage === "none" ) {
                            const filename = post.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => { });
                         }
                        Post.update({ ...postData }, { where: { id: req.params.id } })
                            .then(() => {
                                Post.findOne({
                                    where: { id: req.params.id },
                                    include: [{ model: User, required: true, attributes: ['id', 'firstname', 'lastname', 'username'] }],
                                })
                                    .then((newPost) => {
                                        if (!newPost) {
                                            res.status(404).json({ error: 'Resource not found' });
                                        } else {
                                            res.status(200).json(newPost);
                                        }
                                    })
                                    .catch(() => res.status(500).json({ error : 'Internal server error' }));
                            })
                            .catch(() => res.status(500).json({ error : 'Internal server error' }));
                    } else {
                         return res.status(400).json({ error: 'Client input error' });
                    }
                } else {
                    res.status(401).json({ error: 'Unauthorized request' });
                }
            }
        })
        .catch(() => res.status(500).json({ error : 'Internal server error' }));
};

//DELETE Post -> DELETE
exports.deletePost = (req, res) => {
    Post.findOne({ where: {id: req.params.id} })
        .then((post) => {
            if (!post) {
                res.status(404).json({ error: 'Resource not found' });
            } else {
                if (post.userId === req.auth.userId || req.auth.isAdmin) {
                    if (post.imageUrl) {
                    const filename = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Post.destroy({ where: { id: req.params.id } })
                            .then(() => res.status(200).json({ message: 'Post and image deleted !' }))
                            .catch(() => res.status(500).json({ error: 'Internal server error' }));
                        });
                    } else {
                        Post.destroy({ where: { id: req.params.id } })
                            .then(() => res.status(200).json({ message: 'Post deleted !' }))
                            .catch(() => res.status(500).json({ error: 'Internal server error' }));
                    } 
                } else {
                    res.status(401).json({ error: 'Unauthorized request' });
                }
            }
        })
        .catch(() => res.status(500).json({ error : 'Internal server error' }));
};