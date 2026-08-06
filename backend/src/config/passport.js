import passport from "passport";
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { google_auth_services } from "../services/auth.service.js";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken,refreshToken,Profile,done)=>{
            try{
                const result=await google_auth_services(Profile);
                done(null,result)
            }catch(err){
                return done(err,null)
            }
        }
    )
)

export default passport;