import styles from "./HomePage.module.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Navbar />

      <header className={styles.hero}>
        <h1>Book Your Football Pitch Easily</h1>
        <p>Quick & simple booking for your next game</p>
        <button className={styles.primaryBtn} onClick={() => navigate("/fields")}>
          See Fields
        </button>
      </header>
    </div>
  );

};

export default HomePage;

