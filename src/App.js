import React, { useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import OTPValidationForm from "./components/OTPValidationForm";
import RegistrationForm from "./components/RegistrationForm";
import Userlogin from "./components/userlogin/UserLogin";

function App() {


  return (
    <div className="App">
      <div className="centered-content">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
