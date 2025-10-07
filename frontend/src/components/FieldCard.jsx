import { useNavigate } from "react-router-dom";
import styles from "./styles/FieldCard.module.css"

const FieldCard = ({ field }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleViewDetails = () => {
    navigate(`/fields/${field.id}`, {state: { field }});
  };

  return (
    <div className={ styles.fieldCard }>
      <h3>{field.name}</h3>
      <p>{field.description}</p>
      <p>Location: {field.location}</p>
      <p>Price: {field.price_per_hour} lei/ora</p>
      <img
        src={`${API_URL}${field.image_path}`}
        alt={field.name}
        width="300"
      />
      <button onClick={handleViewDetails}>
        View Details
      </button>
    </div>
  );
};

export default FieldCard;