import { Router } from "express"
import { register, login, getUserProfile, updateUserProfile } from "../controllers/auth.js"
import verifyPassword from "../middleware/verifyPassword.js"
import { createMessage, listMessage } from "../controllers/message.js"
import { likePost, dislikePost } from "../controllers/like.js"
const router = Router()



// user route
router.post('/user/register',  register)
router.post('/user/login', login)
router.get('/user/me', getUserProfile)
router.put('/user/me',updateUserProfile )

//messages route
router.post('/message/new', createMessage)
router.get('/message', listMessage)

// route des : likes et dislikes
router.post('/message/:messageId/like', likePost)
router.post('/message/:messageId/dislike', dislikePost)



export default router 