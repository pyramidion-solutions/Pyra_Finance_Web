import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import logoImage from "../../assets/Images/horizontal.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const defaultTheme = createTheme();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8099/login/api/login",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenauth")}`,
          },
        }
      );
      if (response.status == 200) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("tokenauth", response.data.token);

        window.alert("Login successful");

        // Save "Remember me" choice to localStorage
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        navigate("/layout");
      } else {
        window.alert("Login failed");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.alert("Invalid email or password.");
      } else {
        console.error("Error creating user:", error);
        window.alert("An error occurred");
      }
    }
  };
  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked); // Update "Remember me" state when the checkbox changes
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <img src={logoImage} alt="Your Logo" />
          {/* <h3 background color="black">Pyra Fin</h3> */}
          <div>Pyra Fin</div>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <div>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
                // autoComplete="current-password"
                // onChange={handleChange}
                type={type}
                placeholder="Password"
                onChange={handleChange}
              />
              <span
                className="eye-icon"
                onClick={handleToggle}
                style={{ position: "relative", top: "-45px", left: "260px" }}
              >
                <Icon className="absolute mr-10" icon={icon} size={25} />
              </span>
            </div>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link variant="body2">Forgot password?</Link>
              </Grid>
              <Grid item>
                <Box sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                  {"Don't have an account? Sign Up"}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default Login;
