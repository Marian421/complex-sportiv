
import { useState } from "react";

function RegisterPage() {

    const [info, setInfo] = useState({
        email: '',
        password: '',
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        const changedInfo = {...info, [name]: value};
        setInfo(changedInfo);
    }

    const submitForm = (e) => {
        e.preventDefault();

    }

    return (
        <>
            <form onSubmit={submitForm}>

                <label htmlFor='mail' >Email</label>
                <input 
                type="email" 
                id="mail"
                name="email" 
                value={info.email}
                onChange={handleInputChange} 
                />

                <label htmlFor='password' >Password</label>
                <input 
                type="password" 
                id="password"
                name="password" 
                value={info.password}
                onChange={handleInputChange} 
                />

                <label htmlFor="submit">Submit</label>
                <input type="submit"
                id="submit"
                name="submit"
                value="submit" />
            </form>
        </>
    )
}

export default RegisterPage;