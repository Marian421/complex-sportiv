import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../../services/api";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext"
import styles from "./styles/DeleteAccount.module.css"

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
        <div className={ styles.container }>
            {errorMessage ? 
                <p className={ styles.error-message }>errorMessage</p>
            :
                <>
                    <p className={ styles.message }>Are you sure you want to delete your account?</p>
                    <button className={ styles.deleteButton } onClick={ () => handleDelete() }>Yes, delete</button>
                </>
            }
        </div>
    )
}

export default DeleteAccount;