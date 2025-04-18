import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    }
    return (
        <div>
            <p>Home Page</p>
            <button onClick={ () => handleNavigation("/login") }>Log in</button>
            <button onClick={ () => handleNavigation("/register") }>Register</button>
            <button onClick={ () => handleNavigation("/register") }>See fields</button>
        </div>
    )
}

export default HomePage;