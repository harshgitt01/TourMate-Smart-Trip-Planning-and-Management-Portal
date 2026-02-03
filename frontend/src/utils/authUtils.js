// 1. Get the raw token string
export const getToken = () => {
    return localStorage.getItem('token');
};

// 2. Get the User Role
export const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role; 
    } catch (e) {
        return null;
    }
};

// 3. Check if Admin
export const isAdmin = () => {
    const role = getUserRole();
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
};

// 4. Get the User ID
export const getUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Returns the ID from the token payload (checks both common naming conventions)
        return payload.id || payload.userId; 
    } catch (e) {
        return null;
    }
};