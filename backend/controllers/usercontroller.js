const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const User = require('../models/user');

// SIGNUP
exports.signup = (req, res) => {
    if (req.body.email && req.body.password && req.body.firstname && req.body.lastname) {
        // Email encryption
        const cryptoJsEmail = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL_KEY}`).toString();
        User.findOne({ attributes: ['email', 'isActive'], where: { email: cryptoJsEmail } })
            .then((user) => {
                if (!user) {
                    // Password hash + salt 
                    bcrypt.hash(req.body.password, 10)
                        .then(hash => {
                        // Create user and save in DB
                        User.create({
                            email: cryptoJsEmail,
                            password: hash,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname
                        })
                            .then(() => res.status(201).json({ message : 'User created !'}))
                            .catch(() => res.status(500).json({ error: 'Internal server error' }));
                        })
                        .catch(() => res.status(500).json({ error: 'Internal server error'}));
                } else if (user.isActive === false) {
                    return res.status(403).json({ error: 'Account deactivated ! Please contact your admin.' });
                } else {
                    return res.status(400).json({ error: 'Client input error' });
                }
            })
            .catch(() => res.status(500).json({ error: 'Internal server error' }));
    } else {
        return res.status(400).json({ error: 'Client input error / missing password, email, firstname and/or lastname' });
    }
};

// LOGIN
exports.login = (req, res) => {
    const cookies = req.cookies;
    if (cookies?.jwt) {
        // delete RT cookie as we are gonna send a new one
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    }
    if (req.body.email && req.body.password) {
        const cryptoJsEmail = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL_KEY}`).toString();
        User.findOne({ attributes: ['id','email','password','isActive', 'isAdmin'], where: { email: cryptoJsEmail }})
            .then((user) => {
                // Check if user exists in DB
                if (!user) {
                    return res.status(400).json({ message: 'Invalid User and/or password !' });
                 }  else if (user.isActive === false) {
                    return res.status(403).json({ message: 'Account deactivated ! Please contact your admin.' });
                } else {
                    // Check if password is valid
                    bcrypt.compare(req.body.password, user.password) 
                        .then((validPassword) => {
                            if (!validPassword) {
                                return res.status(401).json({ message: 'Invalid user and/or Password !' })
                            } else {
                                const refreshToken = jwt.sign({
                                    userId: user.id,
                                    isAdmin: user.isAdmin
                                    },
                                    `${process.env.JWT_REFRESHTOKEN}`,
                                    { expiresIn: `${process.env.JWT_REFRESHTOKEN_EXPIRESIN}` } );

                                User.update({ refreshToken: refreshToken }, { where: { email: cryptoJsEmail } })
                                    .then(() => {
                                        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 *1000});
                                        res.status(200).json({
                                        // Create token
                                        userId: user.id,
                                        isAdmin: user.isAdmin,
                                        token: jwt.sign({
                                            userId: user.id,
                                            isAdmin: user.isAdmin
                                            },
                                            `${process.env.JWT_TOKEN}`,
                                            { expiresIn: `${process.env.JWT_TOKEN_EXPIRESIN}` }  
                                            )
                                        });
                                    })
                                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            }
                        })
                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
                }
            })
            .catch(()=> res.status(500).json({ error: 'Internal server error' }));
    } else {
        return res.status(400).json({ error: 'Client input error' });
    }
};

// handle REFRESHTOKEN
exports.handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ error: 'Unauthorized request !' });
    } else {
        const refreshToken = cookies.jwt;
        // search user with RT we received
        User.findOne({ where: { refreshToken: refreshToken } })
            .then((user) => {
                // if didn't find user but received RT => means RT has already been used + doesn't exist anymore 
                // => RT reuse Detection situation
                if (!user) {
                    // decode received RT and match userId to user in DB and delete RT in Db and clear Cookie
                    try {
                        // find "hackedUser" by its id in RT + delete RT in DB  and clear Cookie
                        const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN);
                        User.update({ refreshToken: null }, { where: { id: decodedToken.userId } });
                    } catch (err) {
                        // if err means it couldn't decode RT + Rt is expired / no longer valid
                        console.log(err);
                    } finally {
                        // attempt to use RT that has already been used and invalidated in Rt rotation
                        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                        return res.status(401).json({ message: 'Unauthorized !' });
                    }
                } else if (user.isActive === false) {
                    return res.status(403).json({ message: 'Account deactivated ! Please contact your admin.' });
                } else {
                    // we have a valid RT and issue a new accesstoken AND a new RT
                    try {
                        const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESHTOKEN);
                        // not "correct" User
                        if (user.id !== decodedToken.userId) {
                            User.update({ refreshToken: null }, { where: { id: decoded.userId } });
                            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                            return res.status(401).json({ message: 'Unauthorized RT !' });
                        }
                        // RT valid and found user
                        const newRefreshToken = jwt.sign({
                            userId: user.id,
                            isAdmin: user.isAdmin
                            },
                            `${process.env.JWT_REFRESHTOKEN}`,
                            { expiresIn: `${process.env.JWT_REFRESHTOKEN_EXPIRESIN}` } );
                        // Replace old Rt with new one in DB
                        User.update({ refreshToken: newRefreshToken }, { where: { id: decodedToken.userId } });
                        // send new RT in http only secure cookie
                        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                        // and send new accessToken
                        res.status(200).json({
                            userId: decodedToken.userId,
                            isAdmin: decodedToken.isAdmin,
                            token: jwt.sign({
                                userId: decodedToken.userId,
                                isAdmin: decodedToken.isAdmin
                                },
                                `${process.env.JWT_TOKEN}`,
                                { expiresIn: `${process.env.JWT_TOKEN_EXPIRESIN}` }  
                            )
                        });
                    } catch (err) { 
                        // if err we found the user with the correct Rt but Rt has expired => delete RT from database
                        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                        User.update({ refreshToken: null }, { where: { id: user.id } });
                        return res.status(401).json({ message: 'Unauthorized Expired RefreshToken !' });
                    } 
                }
            })
            .catch(() => res.status(401).json({ error: "Expired RefreshToken" }));
    }
}

// LOGOUT USER
exports.logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(204).json({ message: 'No content !' });
    } else {
        const refreshToken = cookies.jwt;
        User.findOne({ where: { refreshToken: refreshToken } })
            .then((user) => {
                if (!user) {
                    // clear cookie => needs the same otions as when you create cookie apart from maxAge
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.status(204).json({ message: 'No content !' });
                } else {
                    // delete refreshToken in DB
                    User.update({ refreshToken: null }, { where: { refreshToken: refreshToken } })
                        .then(() => res.status(200).json({ message: "User logged out !" }))
                        .catch(() => res.status(500).json({ error: 'Internal server error' }));
                    //clear cookie
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                }
            })
            .catch(()=> res.status(500).json({ error: 'Internal server error' }));
    }
};

// GET USERINFO for one user
exports.getOneUser = (req, res) => {
    User.findOne({
        attributes: ['id', 'firstname', 'lastname', 'username'],
        where: { id: req.auth.userId }
        // if use id as params in url => check id = id in url & id in auth
        //where: {[Op.and]: [{id: req.params.id}, {id: req.auth.userId}]}
    })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized request !' });
            } else {
                return res.status(200).json(user);
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' }))
}; 

// MODIFY USER
exports.modifyUser = (req, res) => {
    const userData = { ...req.body };
    // if use id as params in url => check id = id in url & id in auth
    // User.findOne({ where: { [Op.and]: [{ id: req.params.id }, { id: req.auth.userId }] } })
    User.findOne({ attributes: ['id', 'firstname', 'lastname', 'password'], where: { id: req.auth.userId } })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized request !' });
            } else {
                if (userData.newPassword && userData.oldPassword) {
                    // Check if password is valid
                    bcrypt.compare(userData.oldPassword, user.password)
                        .then((validPassword) => {
                            if (!validPassword) {
                                return res.status(401).json({ message: 'Client input error1' });
                            } else {
                                bcrypt.hash(userData.newPassword, 10)
                                    .then(hash => {
                                        delete userData.oldPassword;
                                        // if use id as params in url => check id = id in url & id in auth
                                        //User.update({ ...userData, password: hash }, { where: { id: req.params.id, id: req.auth.userId } })
                                        User.update({ ...userData, password: hash }, { where: { id: req.auth.userId } })
                                            .then(() => res.status(200).json({ message: 'User updated !' }))
                                            .catch(() => res.status(500).json({ error: 'Internal server error' }));
                                    })
                                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
                            }
                        })
                        .catch(() => res.status(500).json({ error: 'Internal server error' }));
                } else if (!userData.newPassword && !userData.oldPassword) {
                    // if use id as params in url => check id = id in url & id in auth
                    //User.update({ ...userData }, { where: { id: req.params.id, id: req.auth.userId } })
                    User.update({ ...userData }, { where: { id: req.auth.userId } })
                        .then(() => res.status(200).json({ message: 'User updated !' }))
                        .catch(() => res.status(500).json({ error: 'Internal server error' }));
                } else {
                    return res.status(401).json({ message: 'Client input error2' });
                }
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' }));
};

// DELETE USER
exports.deleteUser = (req, res) => {
    // if use id as params in url => check id = id in url & id in auth
    // User.findOne({ where: {[Op.and]: [{id: req.params.id}, {id: req.auth.userId}]} })
    User.findOne({ where: { id: req.auth.userId } })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized request !' });
            } else {
                // if use id as params in url => check id = id in url & id in auth
                // User.destroy({ where: { id: req.params.id, id: req.auth.userId } })
                User.destroy({ where: { id: req.auth.userId } })
                    .then(() => res.status(200).json({ message: 'User deleted !' }))
                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' }));
};

// DEACTIVATE USER
// if deactivated , admin change isActive in DB
exports.deactivateUser = (req, res) => {
    User.findOne({ where: { id: req.auth.userId } })
        .then((user) => {
            if (user) {
                User.update({ isActive: false }, { where: { id: req.auth.userId } })
                    .then(() => res.status(200).json({ message: "User deactivated !" }))
                    .catch(() => res.status(500).json({ error: 'Internal server error' }));
            } else {
                return res.status(401).json({ error: 'Unauthorized request !' });
            }
        })
        .catch(() => res.status(500).json({ error: 'Internal server error' }))
};