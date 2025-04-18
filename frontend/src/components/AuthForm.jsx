import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

const AuthForm = ({ formType }) => {
    const isRegister = formType === "register";
    const navigate = useNavigate(); 
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(isRegister && { name: "", confirmPassword: "" }) 
    });
    const [errors, setErrors] = useState({});

    const passwordRef = useRef(null);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let errors = {};
        
        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Invalid email format";
        }

        if (!formData.password.trim()) {
            errors.password = "Password is required";
        } else if (formData.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        if (isRegister) {
            if (!formData.name.trim()) {
                errors.name = "Name is required";
            }
            if (!formData.confirmPassword.trim()) {
                errors.confirmPassword = "Confirm Password is required";
            } else if (formData.password !== formData.confirmPassword) {
                errors.confirmPassword = "Passwords do not match";
            }
        }

        setErrors(errors);
        return Object.keys(errors).length === 0; 
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log(`${formType} form submitted!`, formData);
            try {
                const response = isRegister ? await registerUser(formData) : await loginUser(formData);
    
                if (response.ok){
                    setErrorMessage("");
                    navigate('/');
                } else {
                    setErrorMessage("Wrong email or password");
                    setFormData({ ...formData, password: "" });
                    passwordRef.current.focus();
                    console.log("error")
                }
            } catch(error) {
                console.error("Fetch error", error.message)
            }
        }
    };

    return (
        <form onSubmit={submitForm}>
            <h2>{isRegister ? "Register" : "Login"}</h2>

            {isRegister && (
                <div>
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                </div>
            )}

            <div>
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    ref={passwordRef}
                />
                {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
            </div>

            {isRegister && (
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                    />
                    {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
                </div>
            )}

            {errorMessage && (<p style={{ color: 'red' }}>{errorMessage}</p>)}  

            <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
    );
};

export default AuthForm;
