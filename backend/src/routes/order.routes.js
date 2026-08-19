import express from 'express';
import {create_order,get_student_orders,get_order_by_id} from '../controllers/order.controller.js';
import { verify_token } from '../middleware/auth.middleware.js';
import { upload_order_document } from '../middleware/upload.middleware.js';

const router =express.Router();

router.post('/',verify_token,upload_order_document.single('document'),create_order);
router.get('/',verify_token,get_student_orders)
router.get('/:id',verify_token,get_order_by_id);

export default router;