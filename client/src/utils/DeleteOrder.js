import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DeleteOrder = ({ show, order }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const { reset, handleSubmit } = useForm();
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const deleteOrder = async () => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `/orders/orders/${order.id}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error deleting order: " + responseData.message);
        console.error("Error deleting order:", responseData);
      }
    } catch (error) {
      setServerResponse("Error deleting order. Please try again later.");
      console.error("Error deleting order:", error);
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

      <Form onSubmit={handleSubmit(deleteOrder)}>
        <p>Are you sure you want to delete order {order.id}?</p>

        <div className="text-end">
          <Button variant="danger" type="submit">
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DeleteOrder;
