import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CreateNewOrder = ({ show }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [medicines, setMedicines] = useState([]);
  const [serverResponse, setServerResponse] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("medicines/medications");
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const submitForm = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
      const orderType = data.order_type === "Shipping";

      const body = {
        user_id: parseInt(data.user_id),
        medication_id: parseInt(data.medication_id),
        quantity: parseInt(data.quantity),
        order_type: orderType,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch("/orders/orders", requestOptions);
      const responseData = await response.json();

      setServerResponse(responseData.message);
    } catch (error) {
      console.error("Error:", error);
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

      <Form onSubmit={handleSubmit(submitForm)}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User ID"
                {...register("user_id", { required: true })}
              />
              {errors.user_id && (
                <p className="text-danger small">User ID is required</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Medicine</Form.Label>
              <Form.Select {...register("medication_id", { required: true })}>
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </Form.Select>
              {errors.medication_id && (
                <p className="text-danger small">Medicine is required</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Quantity"
                {...register("quantity", { required: true })}
              />
              {errors.quantity && (
                <p className="text-danger small">Quantity is required</p>
              )}
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Order Type</Form.Label>
              <Form.Select {...register("order_type", { required: true })}>
                <option value="">Select Order Type</option>
                <option value="Shipping">Shipping</option>
                <option value="Pickup">Pickup</option>
              </Form.Select>
              {errors.order_type && (
                <p className="text-danger small">Order Type is required</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default CreateNewOrder;
