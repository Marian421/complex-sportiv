import { useEffect, useState } from "react";
import { fetchFields } from "../services/api";

const FieldsList = () => {
  const [fields, setFields] = useState([]);

  useEffect(async () => {
    const response = await fetchFields();
    const data = await response.json();
    setFields(data);
  }, []);

  return (
    <div>
      <h2>Available Fields</h2>
      <div className="fields-container">
        {fields.map((field) => (
          <div key={field.id} className="field-card">
            <h3>{field.name}</h3>
            <p>{field.description}</p>
            <p>Location: {field.location}</p>
            <p>Price: ${field.price_per_hour}/hr</p>
            <img
              src={`http://localhost:5000${field.image_path}`}
              alt={field.name}
              width="300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldsList;