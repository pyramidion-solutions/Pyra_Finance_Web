import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { TextField, Button, Container, Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle } from "@mui/icons-material";
import "./RegistrationForm.css";
import logoImage from "../components/assets/pyraimage.png";
import { Link } from "react-router-dom";
import OTPValidationForm from "./OTPValidationForm";
import * as Yup from 'yup'; // Import Yup

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Define the validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema, // Pass the validation schema to Formik
    onSubmit: (values) => {
      setOtpSent(true);
      // send OTP API call
    }
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Container className="centered-container">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AccountCircle style={{ fontSize: "64px", color: "#FBC91B" }} /> {/* Signup icon */}
          <h1 style={{ fontSize: "24px", color: "black" }}>Signup</h1>
          <img src={logoImage} alt="Your Logo" />
        </div>
        <h4>PYRA-FIN</h4>
        {!otpSent ? (
          <form onSubmit={formik.handleSubmit}>
            <TextField
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              style={{ marginBottom: "1rem", width: "100%", maxWidth: "350px" }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <br />
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              style={{ marginBottom: "1rem", width: "100%", maxWidth: "350px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Grid container style={{ marginBottom: "1rem" }}>
              <Grid item xs={12}>
                <Link href="/register" variant="h2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginBottom: "1rem" }}
            >
              NEXT
            </Button>
          </form>
        ) : (
          <div>
            <OTPValidationForm email={formik.values.email} password={formik.values.password} />
          </div>
        )}
      </Container>
    </>
  );
};

export default RegistrationForm;
