
import User from "../models/user.js"
import Message from "../models/message.js"
import Like from "../models/like.js"

import asyncArg from 'async';
import { getUserId , generateTokenForUser} from "../utils/jwt.utils.js"

const DISLIKED = 0;
const LIKED = 1;



const likePost = (req, res) => {
// getting auth
    let headerAuth  = req.headers['authorization'];
    let userId = getUserId(headerAuth);
    
    // params 
    let messageId = parseInt(req.params.messageId)
    if (messageId <= 0) {
        return res.status(400).json({ msg : "invalid parameters "})
    }

    asyncArg.waterfall([
        function (done) {
            Message.findOne({
                where: { id: messageId }
            }).then(function (messageFound) {
                done(null, messageFound)
            }).catch((err) => {
                res.status(500).json({ msg: " unable to verify message " })
            });
        },
        function (messageFound, done) {
            if (messageFound) {
                User.findOne({
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, messageFound, userFound)
                }).catch((err) => {
                    return res.status(500).json({ msg: "unable to verify user " })
                });
            } else {
                res.status(404).json({ msg: "post already liked" });
            }
        },
        function (messageFound, userFound, done) {
            if (userFound) {
                Like.findOne({
                    where: {
                        userId: userId,
                        messageId: messageId
                    }
                }).then(function (userAlreadyLikedFound) {
                    done(null, messageFound, userFound, userAlreadyLikedFound)
                
                
                }).catch((err) => {
                    return res.status(500).json({ msg: "uable to vrify is user already liked" })
                
                })
            } else {
                res.status(404).json({ msg: " user not exist " })
            }
        
        },
        function (messageFound, userFound, userAlreadyLikedFound, done) {
            if (!userAlreadyLikedFound) {
                messageFound.addUser(userFound, { isLiked: LIKED }).then(function (alreadyLikedFound) {
                    done(null, messageFound, userFound)
                }).catch((err) => {
                    res.status(500).json({ msg: " unable to set user reaction " })
                })
            } else {
                if (userAlreadyLikedFound.isLike === DISLIKED) {
                    userAlreadyLikedFound.update({
                        isLiked: LIKED,
                    }).then(function () {
                        done(null, messageFound, userFound)
                    }).catch((err) => {
                        res.status(500).json({ msg: " cannot update user reaction " })
                    });
                } else {
                    res.status(500).json({ msg: "message already liked " })
                }
            }     
        },

        function (messageFound, userFound, done) {
            messageFound.update({
                likes: messageFound.likes + 1,
            
            }).then(function () {
                done(messageFound)
            }).catch((err) => {
                res.status(500).json({ msg: "cannot update like counter " })
            });
        }
    ], function (messageFound) {
        if (messageFound) {
            return res.status(201).json(messageFound)

        } else {
            res.status(500).json({ msg: "cannot update message " })

        }
    });
}

const dislikePost = (req, res) => {

// getting auth header
    let headerAuth = req.headers['authorisation'];
    let userId = getUserId(headerAuth);
    // params
    let messageId = parseInt(req.params.messageId);
    if (messageId <= 0) {
        return res.status(400).json({ msg : "invalid parameters"})
    }

    asyncArg.waterfall([
        function (done) {
            Message.findOne({
                where: { id: messageId }
            }).then(function (messagefound) {
                done(null, messagefound)
            
            }).catch((err) => {
                return res.status(500).json({ msg: " unable to verify message " })
            })
        },
        function (messageFound, done) {
            if (messageFound) {
                User.findOne({
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, messageFound, userFound)
                }).catch((err) => {
                    return res.status(500).json({ msg: "unable to verify user " })
                })
            } else {
                return res.status(404).json({ msg: "post already liked" })
            }
        },
        function (messageFound, userFound, done) {
            if (userFound) {
                Like.findOne({
                    where: {
                        userId: userId,
                        messageId: messageId
                    }
                }).then(function (userAlreadyLikedFound) {
                    done(null, messageFound, userFound, userAlreadyLikedFound);
                }).catch((err) => {
                    return res.status(500).json({ msg: " unable to verify is user already liked " })
                });
            } else {
                return res.status(404).json({ msg: "user not exist " })
            }
        
        },
        function (messageFound, userFound, userAlreadyLikedFound, done) {
            if (!userAlreadyLikedFound) {
                messageFound.addUser(userFound, { isLike: DISLIKED }).then({
                    function(alreadyLikeFound) {
                        done(null, messageFound, userFound)
                    }
                
                }).catch((err) => {
                    return res.status(500).json({ msg: " unable to set user reation" })
                
                })
            } else {
                if (userAlreadyLikedFound.isLike === LIKED) {
                    userAlreadyLikedFound.update({
                        isLike: DISLIKED,
                    }).then(function () {
                        done(null, messageFound, userFound)
                    
                    }).catch((err) => {
                        return res.status(500).json({ msg: " cannot update user reaction " })
                                
                    })
                } else {
                    return res.status(409).json({ msg: " message already disliked " })
                
                }
            }
        },
        function (messageFound, userFound, done) {
            messageFound.update({
                Likes: messageFound.Likes - 1
            }).then(function () {
                done(messageFound)

            }).catch((err) => {
                return res.status(500).json({ msg: " cannot update message like counter " })
            
            });
        },
    ], function (messageFound) {
        if (messageFound) {
            return res.status(201).json(messageFound)

        } else {
            return res.status(500).json({ msg: " cannot update message " })
        
        }
    });
}

export { likePost, dislikePost}