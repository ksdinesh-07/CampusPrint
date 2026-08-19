export const is_authenticated = () => {
    return !!localStorage.getItem("token");
};

export const get_token = () => {
    return localStorage.getItem("token");
};

export const get_user = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const get_role = () => {
    return get_user()?.role ?? null;
};

export const is_admin = () => {
    return get_role() === "admin";
};

export const is_student = () => {
    return get_role() === "student";
};

export const is_staff = () => {
    return get_role() === "staff";
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};