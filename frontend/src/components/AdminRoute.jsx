import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/authUtils';

const AdminRoute = ({ children }) => {
    if (!isAdmin()) {
        alert("Access Denied: Admins Only!");
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default AdminRoute;