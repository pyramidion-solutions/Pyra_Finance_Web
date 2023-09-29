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
    setOTP(value);

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.length === 6) {
      axios
        .post("http://localhost:8080/otp/verify_otp", { otp })
        .then((response) => {
          const isValid = response.data.isValid;
          if (isValid) {
            window.location.href = "/dashboard";
          } else {
            alert("Invalid OTP. Please enter a valid OTP.");
            setError(true);
          }
        })
        .catch((error) => {
          alert("Error validating OTP:" + error.response.data);
          setError(true);
        });
    } else {
      alert("Invalid OTP. Please enter a valid OTP.");
      setError(true);
    }
  };

  if (resendTimer > 0) {
    try {
      const response = axios.post("/otp/send_otp", {
        email,
        otp,
      });

      if (response.status === 200) {
        alert("OTP successfully re-sent!");
      } else {
        setError(true);
      }
    } catch (error) {
      alert("Error re-sending OTP:", error);
      setError(true);
    }
  }
};

const handleResend = () => {
  setResendTimer(60);
};

useEffect(() => {
  const timerInterval = setInterval(() => {
    if (resendTimer > 0) {
      setResendTimer((prevTimer) => prevTimer - 1);
    }
  }, 1000);

  return () => clearInterval(timerInterval);
}, [resendTimer]);

useEffect(() => {
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
      Please enter the  verification code that was sent. The code is valid for {resendTimer} seconds.

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
      disabled={resendTimer > 0}
    >
      Resend OTP ({resendTimer}s)
    </Button>
  </Container>
);
}

export default OTPValidationForm;




