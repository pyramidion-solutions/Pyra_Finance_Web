import { Container, Typography, TextField, Button, ListItemIcon } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./OTPValidationForm.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import axios from "axios"

function OTPValidationForm({ email }) {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOTP(value);
      setError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verify OTP API Call
    // If success redirect to dashboard
    // else (failed) Show invalid otp in toast 
    // otp timeout show Resend OTP button (Until hide this button) , Call Send OTP API call
    // if (otp.length === 6) {
    //   axios
    //     .post("http://localhost:3001/send-otp", { otp })
    //     .then((response) => {
    //       const isValid = response.data.isValid;
    //       if (isValid) {
    //       } else {
    //         setError(true);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error validating OTP:", error);
    //       setError(true);
    //     });
    // } else {
    //   setError(true);
    // }
  };

  const handleResend = () => {
    setResendTimer(60);
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (resendTimer > 0) {
        setResendTimer((prevTimer) => prevTimer - 1);
      }
    }, 1000); // Update the timer every 1 second

    // Clear the timer interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [resendTimer]);

  useEffect(() => {
    // When the timer reaches 0, automatically enable the "Resend OTP" button
    if (resendTimer === 0) {
      clearInterval(resendTimer);
    }
  }, [resendTimer]);

  return (
    <Container
      maxWidth="xs"
      className="otpcentered-container"
    >
      <ListItemIcon>
        <MailOutlineIcon fontSize="large" />
      </ListItemIcon>
      <Typography variant="h3" gutterBottom>
        Check your email!
      </Typography>
      <Typography variant="p" gutterBottom>
        Please enter the 6-digit verification code that was sent. The code is valid for {resendTimer} seconds.

      </Typography>

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
          disabled={otp.length !== 6}
          style={{ marginBottom: "2rem" }}
        >
          Validate OTP
        </Button>
      </form>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={handleResend}
        disabled={resendTimer > 0} // Disable the button when the timer is running
      >
        Resend OTP ({resendTimer}s)
      </Button>
    </Container>
  );
}

export default OTPValidationForm;




