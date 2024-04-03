import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Deletemedicine = ({ show, medicine }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const { reset, handleSubmit } = useForm();
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const Deletemedicine = async () => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `/medicines/medications/${medicine.id}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error deleting medicine: " + responseData.message);
        console.error("Error deleting medicine:", responseData);
      }
    } catch (error) {
      setServerResponse("Error deleting medicine. Please try again later.");
      console.error("Error deleting medicine:", error);
    }
  };

  return (
    <div style={{ display: show ? "block" : "none" }}>
      {serverResponse && (
        <Alert
          variant={
            serverResponse.includes("successfully") ? "success" : "danger"
          }
        >
          {serverResponse}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(Deletemedicine)}>
        {/* Display confirmation message */}
        <p>Are you sure you want to delete medicine {medicine.name}?</p>
        {/* Button to submit the form */}
        <Button variant="danger" type="submit">
          Delete
        </Button>
      </Form>
    </div>
  );
};

export default Deletemedicine;
