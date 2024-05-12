import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthContext();
    if (!user) {
        // Redirect to the login page
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute
