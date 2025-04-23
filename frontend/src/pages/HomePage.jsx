import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleNavigation = (path) => {
        navigate(path);
    }
    return (
        <div>
            <p>Home Page</p>
            {!user ? 
                (<>
                <button onClick={ () => handleNavigation("/login") }>Log in</button>
                <button onClick={ () => handleNavigation("/register") }>Register</button>
                </>
                ) :
                (
                <button>Profile</button>
                )
            }
            <button onClick={ () => handleNavigation("/fields") }>See fields</button>
            {user && <button onClick={() => logout()}>Log out</button>}
        </div>
    )
}

export default HomePage;