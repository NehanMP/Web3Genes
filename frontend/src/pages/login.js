import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h3>Log in</h3>
                <p>Lorem ipsum dolor sit amet consectetur. Risus commodo faucibus pellentesque habitant. Tincidunt</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type='email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="Email"
                            required
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Password"
                            required
                        />
                    </div>                   
                    
                    <div className="form-footer">     
                        <p className="forgot-password">Forgot Password</p>
                    </div>

                    <button type="submit" disabled={isLoading} className="login-btn">Login</button>
                    
                    {error && <div className='error'>{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Login;
