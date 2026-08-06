import {db} from '../config/db.js';

export const find_user_by_email=async (email)=>{

    const query=`SELECT * FROM users where email=?`
    const [rows]=await db.query(query,[email]);
    return rows[0];

}

export const create_user=async(data)=>{
    
    const query=`insert into users(google_id,name, email, password_hash, phone, department, role) values (?,?,?,?,?,?,?)`;
    const values=[data.google_id ?? null,data.name,data.email,data.password_hash,data.phone,data.department,data.role];
    const [result] = await db.execute(query,values);
    return result.insertId;

}

export const update_google_id=async (id,google_id)=>{
    const query=`update users set google_id =? where id=?`;
    await db.execute(query,[google_id,id])
}


export const find_user_by_id = async (id) => {
    const query = `SELECT id, google_id, name, email, phone, department, role, created_at FROM users WHERE id = ?`;
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};