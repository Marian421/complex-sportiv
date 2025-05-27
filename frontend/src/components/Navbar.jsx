import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./styles/Navbar.module.css"

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleNavigation = (path) => {
      navigate(path);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo} onClick={() => handleNavigation("/")}>⚽ Football Booker</div>
            <div className={styles.navLinks}>
            <button onClick={() => handleNavigation("/fields")} >Fields</button>
            {user ? (
                <>
                <button onClick={() => handleNavigation("/profile")}>Profile</button>
                <button onClick={logout}>Log Out</button>
                </>
            ) : (
                <>
                <button onClick={() => handleNavigation("/login")}>Log In</button>
                <button onClick={() => handleNavigation("/register")}>Register</button>
                </>
            )}
            </div>
      </nav>
    );
};

export default Navbar;