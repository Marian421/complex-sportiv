import { useState } from "react";
import { deleteField } from "../../../services/api";
import FieldSelector from "../Components/FieldSelector";
import useFieldAndDateManager from "../hooks/useFieldAndDateManager";
import Modal from "react-modal";

const RemoveField = () => {

    const {
      fieldId,
      setFieldId,
      fields,
    } = useFieldAndDateManager();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const response = await deleteField(fieldId);
            console.log("Delete response:", response);
            setIsModalOpen(false);
        } catch (err) {
         console.error("Delete failed:", err);
        }
    };

    return (
        <div>
            <FieldSelector fields={fields} value={fieldId} onChange={setFieldId} />
            <button onClick={() => setIsModalOpen(true)}>Delete Field</button>

            <Modal
                isOpen={isModalOpen}
                contentLabel="Confirm Booking"
                style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
                content: {
                    position: "static",
                    inset: "unset",
                    maxWidth: "400px",
                    width: "90%", 
                    margin: "auto",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "none",
                    textAlign: "center",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                },
                }}
                >
                <h2>Are you sure you want to delete this field?</h2>
                <button onClick={handleDelete}>Yes, delete it</button>
                <button onClick={() => setIsModalOpen(false)}>
                Cancel
                </button>
            </Modal>
        </div>
    )
};

export default RemoveField;