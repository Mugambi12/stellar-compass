import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const UpdateOrder = ({ show }) => {
  const [serverResponse, setServerResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Add your update order logic here
    setServerResponse("Order updated successfully!");
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

      <Form onSubmit={handleSubmit}>
        {/* Add your form fields for updating orders */}
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UpdateOrder;
