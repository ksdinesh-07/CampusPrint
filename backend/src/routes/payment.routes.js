import express from "express";
import { create_payment_order, verify_payment,payment_webhook,get_payment_history } from "../controllers/payment.controller.js";
import {verify_token} from "../middleware/auth.middleware.js";


const router=express.Router();

router.post("/create-order",verify_token,create_payment_order);
router.post("/verify",verify_token,verify_payment);
router.post('/webhook',payment_webhook);
router.get('/history',verify_token,get_payment_history);

export default router;

