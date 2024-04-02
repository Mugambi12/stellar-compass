import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";

const DeleteOrder = ({ show }) => {
  const [serverResponse, setServerResponse] = useState(null);

  const handleDelete = async () => {
    // Add your delete order logic here
    setServerResponse("Order deleted successfully!");
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

      <Button variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
};

export default DeleteOrder;
