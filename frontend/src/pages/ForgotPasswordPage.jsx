import { Link } from "react-router-dom";
import { useState } from "react";
import { forgotPassword } from "../services/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMesage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await forgotPassword(email);

        console.log("Password reset link sent to:", email);
        
        setSubmitted(true);
    } catch (error) {
        console.error("Fetch error", error.message);
        setEmail("");
    } 
  };

  return (
    <div>
      <h1>Forgot your password?</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <p>
            Enter your email and we’ll send you a reset link.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <button
            type="submit"
          >
            Send reset link
          </button>
          <div>
            <Link to="/login">
              Back to login
            </Link>
          </div>
        </form>
      ) : (
        <div>
          Check your email — if it exists in our system, you’ll get a reset link
          shortly.
          <div>
            <Link to="/login">
              Back to login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
