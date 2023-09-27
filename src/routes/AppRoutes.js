import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import RegistrationForm from "../components/RegistrationForm";
import OTPValidationForm from "../components/OTPValidationForm";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/otp" element={<OTPValidationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
