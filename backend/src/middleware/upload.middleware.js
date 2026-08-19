import multer from 'multer';
import path from 'path';
import fs from 'fs';

const upload_dir='upload/orders';

if (!fs.existsSync(upload_dir)){
    fs.mkdirSync(upload_dir,{recursive:true});
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,upload_dir)
    },
    filename:(req,file,cb)=>{
        const unique_name=`${Date.now()}-${Math.round(Math.random() * 1E9 )} ${path.extname(file.originalname)}`;
        cb(null,unique_name);
    }
});

const allowed_file_types = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/octet-stream',
    'image/png'];

const allowed_extensions=['.pdf','.docx','.jpg','.jpeg','.png']

const file_filter=(req,file,cb)=>{
    const extension =path.extname(file.originalname).toLowerCase();

    if (allowed_file_types.includes(file.mimetype) && allowed_extensions.includes(extension)){
        cb(null,true)
    }else{
        cb(new Error('Invalid file type.Only PDF,DOCX,JPG & PNG files are allowed.'))
    }
}

export const upload_order_document=multer({
    storage,fileFilter:file_filter,
    limits:{
        fileSize:10*1024*1024
    }
})