import async_handler from "../utils/asyncHandler.js";
import { create_order_service,get_student_orders_service,get_order_by_id_service } from "../services/order.service.js";

export const create_order = async_handler(async (req, res) => {


    if (!req.file) {
        const error = new Error("Please upload a document");
        error.statusCode = 400;
        throw error;
    }

    const {
        printType,
        pages,
        copies,
        sides,
        lamination
    } = req.body;

    const order = await create_order_service({
        user_id: req.user.id,
        file: req.file,
        print_type: printType,
        pages: Number(pages),
        copies: Number(copies),
        sides,
        lamination: lamination === "true"
    });

    return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order
    });
});

export const get_student_orders=async_handler(async (req,res)=>{
    const order=await get_student_orders_service(req.user.id);
    return res.status(200).json({success:true,message:'Order fetched successfully',data:order})
})

export const get_order_by_id=async_handler(async(req,res)=>{
    const {id}=req.params;
    const order=await get_order_by_id_service(Number(id),req.user.id);
    if(!order){
        const err=new Error('Order Not found');
        err.statusCode=404;
        throw err;
    }
    return res.status(200).json({success:true,message:'Order fetched successfully',data:order})
})