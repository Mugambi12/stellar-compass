import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DeleteUser = ({ show, user }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const { reset, handleSubmit } = useForm();
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const DeleteUser = async () => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(`/users/users/${user.id}`, requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error deleting user: " + responseData.message);
        console.error("Error deleting user:", responseData);
      }
    } catch (error) {
      setServerResponse("Error deleting user. Please try again later.");
      console.error("Error deleting user:", error);
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

      <Form onSubmit={handleSubmit(DeleteUser)}>
        <p>Are you sure you want to delete user {user.username}?</p>

        <div className="text-end">
          <Button variant="danger" type="submit">
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DeleteUser;
