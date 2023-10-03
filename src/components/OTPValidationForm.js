import { Container, Typography, TextField, Button, ListItemIcon } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./OTPValidationForm.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import axios from "axios";

function OTPValidationForm({ email }) {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [signupSuccess, setSignupSuccess] = useState(false); // New state for signup success

  const handleChange = (e) => {
    const value = e.target.value;
    setOTP(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // if (otp.length === 6) {
    axios
      .post("http://localhost:8080/otp/verify_otp", { otp, email: localStorage.getItem("email") })
      .then((response) => {
        const isValid = response.data.isValid;
        console.log(response);

        if (response.data.message == "OTP verified successfully") {
          setSignupSuccess(true); // Set signup success to true
        } else {
          alert("Invalid OTP. Please enter a valid OTP.");
          setError(true);
        }
      })
      .catch((error) => {
        alert("Error validating OTP: " + error.response.data);
        setError(true);
      });
    // } else {
    //   alert("Invalid OTP. Please enter a valid OTP.");
    //   setError(true);
    // }
  };

  const handleResend = () => {
    setResendTimer(60);
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  return (
    <Container maxWidth="xs" className="otpcentered-container">
      <ListItemIcon>
        <MailOutlineIcon fontSize="large" />
      </ListItemIcon>
      <Typography variant="h3" gutterBottom>
        Check your email!
      </Typography>
      <Typography variant="p" gutterBottom>
        Please enter the verification code that was sent. The code is valid for {resendTimer} seconds.
      </Typography>

      {signupSuccess ? (
        // Display success message if signupSuccess is true
        <div>
          <Typography variant="h4" style={{ color: "green" }}>
            Signup successfully!
          </Typography>
        </div>
      ) : (
        // Display the OTP validation form if signupSuccess is false
        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            type="text"
            value={otp}
            onChange={handleChange}
            fullWidth
            error={error}
            helperText={error ? "Invalid OTP. Please enter a 6-digit OTP." : ""}
            style={{
              marginBottom: "3rem",
              backgroundColor: "#F3F3F3",
              borderRadius: "8px",
            }}
            InputProps={{
              style: {
                padding: "9px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginBottom: "2rem" }}
          >
            Validate OTP
          </Button>
        </form>
      )}

      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={handleResend}
        disabled={resendTimer > 0}
      >
        Resend OTP ({resendTimer}s)
      </Button>
    </Container>
  );
}

export default OTPValidationForm;
