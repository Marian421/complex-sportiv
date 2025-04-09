import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const [isValid, setIsValid] = useState(null); // null = loading, true = ok, false = bad
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const verifyCode = async () => {
      const res = await fetch("http://localhost:5000/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if ( res.status === 200) {
        setIsValid(true);
        setResetToken(data.resetToken);
      } else {
        setIsValid(false);
      }
    };

    if (code) {
      verifyCode();
    } else {
      setIsValid(false);
    }
  }, [code]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }


    const res = await fetch("http://localhost:5000/auth/reset-password", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resetToken}`
     },
      body: JSON.stringify({ newPassword }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      alert("Failed to reset password.");
    }
  };

  if (isValid === null) return <p>Checking reset code...</p>;
  if (isValid === false) return <p>Invalid or expired reset link.</p>;
  if (success) return <p>Your password has been updated! 🎉</p>;

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
