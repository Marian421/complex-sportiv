import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../services/api";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"

const DeleteAccount = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const handleDelete = async () => {
        try {
           await deleteUser();
           logout();
           navigate("/"); 
        } catch (error) {
            console.error("Couldn't delete account", error);
            setErrorMessage(error.message);
        }
    }
    
    return (
        <div>
            {errorMessage ? 
                <p>errorMessage</p>
                :
                <>
                <p>Are you sure you want to delete your account?</p>
                <button onClick={ () => handleDelete() }>Yes, delete</button>
                </>
                }
        </div>
    )
}

export default DeleteAccount;