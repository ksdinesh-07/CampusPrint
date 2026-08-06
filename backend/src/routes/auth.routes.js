import express from 'express';
import { register_user,login } from '../controllers/auth.controller.js';
import passport from 'passport';
import { verify_token } from '../middleware/auth.middleware.js';
import { current_user } from '../controllers/auth.controller.js';

const router=express.Router();

router.post('/register',register_user);
router.post('/login',login)
router.get('/me',verify_token,current_user)


router.get('/google',passport.authenticate('google',{scope:['profile','email'],session:false}))
router.get('/google/callback',passport.authenticate('google',{session:false,failureRedirect:'/login'}),
            (req,res)=>{
                const {token}=req.user;
                res.redirect(`http://localhost:5173/oauth-success?token=${token}`)
            }
)



export default router;

