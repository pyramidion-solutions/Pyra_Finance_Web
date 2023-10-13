import React from "react";
import { useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";

const Toast = () => {
  const error = useSelector((state) => state.auth.error);
  const token = useSelector((state) => state.auth.token);

  const handleClose = () => {
    // Handle close event
  };

  return (
    <Snackbar
      open={!!error || !!token}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert severity={error ? "error" : "success"} onClose={handleClose}>
        {error || "Registration successful!"}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
