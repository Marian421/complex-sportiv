import { useState } from "react";

const AuthForm = ({ formType }) => {
    const isRegister = formType === "register"; 

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(isRegister && { name: "", confirmPassword: "" }) 
    });

    const [errors, setErrors] = useState({});

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
                const type = isRegister ? "register" : "login";
                const response = await fetch(`http://localhost:5000/auth/${type}`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify(formData),
                })
                const data = await response.json()
    
                if (response.ok){
                    console.log("succes: ", data)
                } else {
                    console.error("error: ", data.message)
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

            <button type="submit">{isRegister ? "Register" : "Login"}</button>
        </form>
    );
};

export default AuthForm;
