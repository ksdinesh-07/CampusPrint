import express from 'express';
import {error_handler} from './middleware/error.middleware.js'
import auth_routes from './routes/auth.routes.js';
import cors from'cors';
import passport from './config/passport.js';
import order_routes from './routes/order.routes.js'



const app=express();


app.use(cors({
    origin:'http://localhost:5173'
}));

app.use(express.json());
app.use(passport.initialize());


app.get('',(req,res)=>{
    res.json({
        success: true,
        message: "Welcome to the campusprint API"
    });
})

app.use('/api/v1/auth',auth_routes);
app.use('/api/v1/orders',order_routes);


app.use(error_handler);

export default app;