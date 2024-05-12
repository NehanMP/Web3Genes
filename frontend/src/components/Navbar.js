import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from '../hooks/useLogout';
import logo from '../images/logo.png'

const Navbar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();

    return (
        <header>
            <div className="container">
                <div className="logo">
                    <img src={logo} alt="Web3genes Logo" />
                </div>
                
                {user && (
                    <nav>
                        <Link to="/form">User Onboarding</Link>
                        <Link to="/home">User List</Link>
                        <input type="search" placeholder="Search" />
                        <button onClick={logout}>Logout</button>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Navbar;
