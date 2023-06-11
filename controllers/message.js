
import asyncArg from "async";
// @ts-ignore
import jwt from "jsonwebtoken"
// @ts-ignore
import { generateTokenForUser, getUserId } from "../utils/jwt.utils.js"
import User from "../models/user.js";
import Message from "../models/message.js";


const limitTitle = 5;
const limitContent = 10;
const limitItems = 50;

const createMessage = (req, res) => {
// getting auth header
    let headerAuth = req.headers['authorization'];
    // console.log('HEADER AUTH',headerAuth);
    let userId = getUserId(headerAuth);
    // params
    const { title, content } = req.body
    // verif
    if (title == null || content == null) {
        return res.status(400).json({ msg : " missing parameters "})
    }
    if (title.length <= limitTitle || content.length <= limitContent) {
        res.status(400).json({ msg: "invalid parameters" })
    };

    asyncArg.waterfall([
        function (done) {
            User.findOne({ // recup l'utilisateur
                where: { id: userId }
            }).then(function (userFound) { // passer dans le then si user trouvé ou pas
                done(null, userFound)
            // @ts-ignore
            }).catch((err) => {
                return res.status(500).json({ msg: " unable to verify user " })
            })
        },// creer le message l 'assigner et le poster
        function (userFound, done) { // function le user trouvé
            if (userFound) {
                Message.create({ // si user trouvé creer un new message
                    title: title,
                    content: content,
                    likes: 0,
                    UserId: userFound.id // relation
                }).then(function (newMessage) {
                    done(newMessage)
                // @ts-ignore
                }).catch((err) => {
                    return res.status(500).json({ msg: " cannot add new message " })
                })
            } else {
                return res.status(404).json({ msg: " user not found " })
            }
        },
    ], function (newMessage) { // poster msg
        if (newMessage) {
            return res.status(201).json(newMessage);
        } else {
            res.status(500).json({ msg: " cannot post a message " })     
        }
    });

}



// @ts-ignore
const listMessage = (req, res) => {
// lister tout les messages
    let fields = req.query.fields 
// selectinner les colonnes qu'on souhaite afficher
    let limit = parseInt(req.query.limit)
// recup les messages par seqment ( par page)
    let offset = parseInt(req.query.offset)
    // recup par ordre
    let order = req.query.order
    if (limit > limitItems) {
        limit = limitItems
    }


    Message.findAll({ // recup tout les messages
        // les valeurs doit etre not null
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        // @ts-ignore
        limit: (!isNaN(limit)) ? limit : null,
        // @ts-ignore
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: User,
            attributes: ['username']
        }]      
    }).then(function (messages) {
        if (messages) {
            res.status(200).json(messages);
        }else{ res.status(404).json({ msg : " no message found "})}
    }).catch( (err) => { 
        console.log(err)
        res.status(500).json({msg: "invalid fields "})
    })    

}

export { createMessage, listMessage}