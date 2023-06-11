import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateTokenForUser, getUserId }  from "../utils/jwt.utils.js";
import User from "../models/user.js" 
import asyncArg from "async"

// regex de controle email , password
const EMAIL_REGEX = /[a-zA-Z0-9][a-zA-Z0-9_.]+@[a-zA-Z0-9_]+.[a-zA-Z0-9_.]+[a-zA-Z0-9]{2}/
const PASSWORD_REGEX = /^[a-zA-Z0-9_]{6,12}$/

const register = (req, res) => {
    // params
let { email, username, password, bio} = req.body
// verif 
    
    if (email == null || username == null || password == null) {
        return res.status(400).json({ msg: 'missing parameters' })
    };
    if (username.length >= 14 || username.length <= 3) {
    return res.status(400).json({ message : "wrong username, must be length : 4-14"})
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message : " email is not valid, must be one uppercese letter, lowercase letter, ...."})
        
    }

    if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({message : "password : doit etre de 6 a 12 caracteres, majuscules, miniscules ,et des chiffres et underscore"})
    
    }


    // verify pseudo length, mail regex , password
    User.findOne({
        attributes: ['email'],
        where:{email:email}  // verify si exist ou pas dans le db
    }).then(function (userFound) {
        if (!userFound) {
            bcrypt.hash(password, 10, function (err, bcryptedPassword) {
                let newUser = User.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin:0
                }).then(function (newUser) {
                    // @ts-ignore
                    return res.status(201).json({ 'userId': newUser.id })
                }).catch((err) => {
                return res.status(500).json({ msg: "cannot add user "})
                })
            })
        }else{ return res.status(409).json({ msg: "user already exist"})}
    }).catch((err)=>{ return res.status(500).json({msg : "unable to verify user"})})


}

const login = (req, res) => {

    let { email, password } = req.body

    if (email == null || password == null) {
    res.status.json({ message : " missing parameters "})
    }
    User.findOne({ where: { email: email } }).then(userFound => {
        if (userFound) {
            // @ts-ignore
            bcrypt.compare(password, userFound.password, function (err, resBycrypt) {
                if (resBycrypt) {
                    return res.status(200).json({
                        // @ts-ignore
                        'userId': userFound.id,
                        // @ts-ignore
                        'token': generateTokenForUser(userFound)
                    
                    })
                } else {
                    return res.status(403).json({msg: "invalid password"})
                }
            
            })


        } else {
        return res.status(404).json({error : "user not exist in db"})
        
        }
    
    }).catch((err) => {
        return res.status(500).json({ error : "unable to verify user"})
    })

}

const getUserProfile = (req, res) => {
    // le id user est stocker dans la function gerer token
// get auth header : le but est de verif si le token est valide et recup id user
    // pour ensuite faire une requete dans le db
    let headerAuth = req.headers['authorisation'];
    let userId = getUserId(headerAuth)
    if (userId < 0)
        return res.status(400).json({ msg : "wrong token "})
    User.findOne({ // recup les infos user
        attributes: ['id', 'email', 'username', 'bio'],
        where:{ id: userId }
    
    }).then(function (user) {
        if (user) {
            res.status(201).json(user)
        } else {
            res.status(404).json({ msg : "user not found "})
        }
    
    }).catch(function (err) {
    res.status(500).json({ msg : "cannot fetch user "})
    })

}

const updateUserProfile = (req, res) => {
// getting auth header
    let headerAuth = req.headers['authorization'];
    let userId = getUserId(headerAuth)
    // params
    let bio = req.bodty.bio;
    asyncArg.waterfall([
        function (done) {
            User.findOne({
                attributes: ['id', 'bio'],
                where: { id: userId }
            
            }).then(function (userFound) {
                done(null, userFound)
            }).catch((err) => {
                return res.status(500).json({ msg: " unable to verify user" })
            });
        },
        function (userFound, done) {
            if (userFound) {
                userFound.update({
                bio:(bio ? bio :userFound.bio )
                }).then(function () {
                    done(userFound)
                }).catch((err) => {
                    return res.status(500).json({ msg : " cannot update user"})
                
                })
            } else {
            return res.status(404).json({msg : " user not found "})
            }
        },
    ], function (userFound) {
    
        if (userFound) {
            return res.status(201).json(userFound)

        } else {
            return res.status(500).json({ msg: "cannot update user profile"})
        }
    
    })




}

export { register, login , getUserProfile, updateUserProfile}