import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword, verifyResetCode } from "../services/api";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [isValid, setIsValid] = useState(null); // null = loading, true = ok, false = bad
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const verifyCode = async () => {
        await verifyResetCode(code);
        
        setIsValid(true);
      }
      if (code) {
        verifyCode();
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error(error.message)
    }
  }, [code]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(newPassword);

      setSuccess(true);
      
    } catch (error) {
      console.error(error.message);
    }
  };

  if (isValid === null) return <p>Checking reset code...</p>;
  if (isValid === false) return <p>Invalid or expired reset link.</p>;
  if (success) return <p>Your password has been updated!</p>;

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ResetPasswordPage;
