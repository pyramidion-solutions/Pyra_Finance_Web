import React, { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { register } from "./actions/authActions";
import { TextField, Button, Container, Grid, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle } from "@mui/icons-material"; // Import the AccountCircle icon
import "./RegistrationForm.css";
import logoImage from "../components/assets/pyraimage.png";
import { Link } from "react-router-dom";
import axios from "axios";

const RegistrationForm = () => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {

    },
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
        <form onSubmit={formik.handleSubmit}>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            onChange={formik.handleChange}
            value={formik.values.email}
            style={{ marginBottom: "1rem", width: "100%", maxWidth: "350px" }}
          /><br />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            onChange={formik.handleChange}
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
      </Container>
    </>
  );
};

export default RegistrationForm;
