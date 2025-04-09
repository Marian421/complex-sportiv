import { useEffect, useState } from "react";

const FieldsList = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      const res = await fetch("http://localhost:5000/fields");
      const data = await res.json();
      setFields(data);
    };

    fetchFields();
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