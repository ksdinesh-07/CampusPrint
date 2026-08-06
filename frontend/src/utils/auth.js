export const is_authenticated=()=>{
    return !!localStorage.getItem('token')
}

export const get_token=()=>{
    return localStorage.getItem('token')
}

export const get_user=()=>{
    const user=localStorage.getItem('user');
    if(!user) return null;
    return JSON.parse(user)
}

export const get_role=()=>{
    const user=get_user()
    if (!user) return null;
    return user.role;
}

export const is_admin=()=>{
    return get_role()==='admin';
}

export const is_student=()=>{
    return get_role()==='student';
}

export const logout=()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}