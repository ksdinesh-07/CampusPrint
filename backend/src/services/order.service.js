import { db } from "../config/db.js";

const bw_price=2;
const color_price=5;
const lamination_price=10;

export const create_order_service=async({user_id,file,print_type,pages,copies,sides,lamination})=>{
    const per_price_page=print_type==='bw'?bw_price:color_price;

    let printing_cost=pages*copies*per_price_page;

    if (sides=='double'){
        printing_cost*=0.9;
    }

    const lamination_cost=lamination?pages*copies*lamination_price:0;

    const total_cost=printing_cost + lamination_cost;

    const order_number=`CP${Date.now()}`;

    const query=`insert into orders(order_number,user_id,file_name,file_path,file_type,file_size,print_type,pages,copies,sides,lamination,printing_cost,lamination_cost,total_cost)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values=[
        order_number,
        user_id,
        file.originalname,
        file.path,
        file.mimetype,
        file.size,
        print_type,
        pages,
        copies,
        sides,
        lamination,
        printing_cost,
        lamination_cost,
        total_cost
    ];

    const [result] = await db.execute(query,values);
    return{
        id:result.insertId,
        order_number,
        user_id,
        file_name:file.originalname,
        print_type,
        pages,
        copies,
        sides,
        lamination,
        printing_cost,
        lamination_cost,
        total_cost,
        status:'pending',
        payment_status:'pending'
    };
}

export const get_student_orders_service=async (user_id)=>{
    const query=` select
        id, 
        order_number,
        file_name,
        file_type,
        file_size,
        print_type,
        pages,
        copies,
        sides,
        lamination,
        printing_cost,
        lamination_cost,
        total_cost,
        status,
        payment_status,
        created_at,
        updated_at 
        from orders where user_id = ?  order by created_at desc`;

    const [rows] = await db.execute(query,[user_id])
    return rows;
}

export const get_order_by_id_service=async(order_id,user_id)=>{
    const query=`select id,
            order_number,
            file_name,
            file_path,
            file_type,
            file_size,
            print_type,
            pages,
            copies,
            sides,
            lamination,
            printing_cost,
            lamination_cost,
            total_cost,
            status,
            payment_status,
            created_at,
            updated_at
        FROM orders
        WHERE id = ? AND user_id = ? `;
    const [rows]=await db.execute(query,[order_id,user_id]);
    return rows[0];
}