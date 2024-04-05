import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { EyeOutline, EyeOffOutline } from "react-ionicons";

const PasswordToggle = ({ showPassword, togglePassword }) => {
  return (
    <Button
      type="button"
      variant="outline-secondary"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "transparent",
        border: "none",
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
      }}
      onClick={togglePassword}
    >
      {showPassword ? (
        <EyeOffOutline color="#666" />
      ) : (
        <EyeOutline color="#666" />
      )}
    </Button>
  );
};

export default PasswordToggle;
