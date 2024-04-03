// MakePayment.js
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const MakePayment = ({ show, payment }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const { handleSubmit, setValue, reset } = useForm();

  useEffect(() => {
    if (payment) {
      setValue("name", payment.name);
      setValue("manufacturer", payment.manufacturer);
      setValue("category", payment.category);
      setValue("price", payment.price);
      setValue("stock_quantity", payment.stock_quantity);
      setValue("expiry_date", payment.expiry_date);
      setValue("dosage", payment.dosage);
      setValue("description", payment.description);
    }
    setIsLoading(false);
  }, [payment, setValue]);

  const updateForm = async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `/medicines/medications/${payment.id}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error updating payment. Please try again later.");
        console.error("Error updating payment: " + responseData.message);
      }
    } catch (error) {
      setServerResponse("Error updating payment. Please try again later.");
      console.error("Error updating payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

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

      <Form onSubmit={handleSubmit(updateForm)}>
        <p>This is for payment for order {payment.id} </p>

        <div className="text-end">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default MakePayment;
