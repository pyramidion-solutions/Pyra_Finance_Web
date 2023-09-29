import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
