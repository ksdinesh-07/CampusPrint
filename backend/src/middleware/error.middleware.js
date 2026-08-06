export const error_handler=(err,req,res,next)=>{
    const statuscode=err.statusCode || 500;
    return res.status(statuscode).json({
        success:false,
        message:err.message || "Internal Server Error"
    })
}

