import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

// hook for handling user logout
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    // clear user session
    const logout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    return { logout };
};
