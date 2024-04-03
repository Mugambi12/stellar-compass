import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DeleteOrder = ({ show, order }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const deleteForm = async (data) => {
    console.log(data);
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

      <Form onSubmit={handleSubmit(deleteForm)}>
        {/* Add your form fields for updating orders */}
        <p> Are you sure you want to delete {order.id}?</p>
        <Button variant="danger">Delete</Button>
      </Form>
    </div>
  );
};

export default DeleteOrder;
