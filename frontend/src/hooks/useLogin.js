import { useState } from "react";
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error || 'An error occurred');
            } else {
                // Save user to the local storage on login
                localStorage.setItem('user', JSON.stringify(json));

                // Update the auth context
                dispatch({type: 'LOGIN', payload: json});

                setIsLoading(false);

                // Navigate the user to home page
                navigate('/home');
            }
        } catch (err) {
            setIsLoading(false);
            setError('Failed to connect to the service');
        }
    };

    return { login, isLoading, error };
};
