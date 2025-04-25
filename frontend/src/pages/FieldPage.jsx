import { useEffect, useState } from "react";
import { fetchFields } from "../services/api";
import FieldCard from "../components/FieldCard";
import { useNavigate } from "react-router-dom";


const FieldsList = () => {
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await fetchFields();
        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error(error);  
      }
    }

    handleFetch()
  }, []);

  return (
    <div>
      <h2>Available Fields</h2>
      <button onClick={() => navigate("/fields/addField")}>Add a field</button>
      <div className="fields-container">
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default FieldsList;