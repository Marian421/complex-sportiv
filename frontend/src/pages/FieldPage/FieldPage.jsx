import { useEffect, useState } from "react";
import { fetchFields } from "../../services/api";
import FieldCard from "../../components/FieldCard";
import Navbar from "../../components/Navbar";
import styles from "./FieldPage.module.css"


const FieldPage = () => {
  const [fields, setFields] = useState([]);

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
    <div className={ styles.container }>
      <Navbar />
      <h2>Available Fields</h2>
      <div className={ styles.fieldsContainer }>
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default FieldPage;