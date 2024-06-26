// UpdateOrder.js
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const UpdateOrder = ({ show, order }) => {
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setserverResponse] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicineResponse, userDataResponse] = await Promise.all([
          fetch("/medicines/medications"),
          fetch("/users/users"),
        ]);
        const [medicineData, userData] = await Promise.all([
          medicineResponse.json(),
          userDataResponse.json(),
        ]);
        setMedicines(medicineData);
        setUsers(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setserverResponse("Error fetching data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (order) {
      setValue("quantity", order.quantity);
      setValue("shipping", order.shipping ? "Shipping" : "Pickup");
      setValue("user_id", order.user_id);
      setValue("medication_id", order.medication_id);
    }
  }, [order, setValue]);

  const updateForm = async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    const body = {
      user_id: parseInt(data.user_id),
      medication_id: parseInt(data.medication_id),
      quantity: parseInt(data.quantity),
      shipping: data.shipping === "Shipping",
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(
        `/orders/orders/${order.id}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setserverResponse("Error updating order. Please try again later.");
        console.error("Error updating order: " + responseData.message);
      }
    } catch (error) {
      setserverResponse("Error updating order. Please try again later.");
      console.error("Error updating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-auto">
        <Spinner animation="border" variant="primary" />{" "}
        <span className="ms-3"> Loading...</span>
      </div>
    );
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
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Control
                as="select"
                {...register("user_id", { required: true })}
              >
                <option value="">Select User</option>
                {users
                  .slice()
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </Form.Control>
              {errors.user_id && (
                <p className="text-danger small">User is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Medicine</Form.Label>
              <Form.Control
                as="select"
                {...register("medication_id", { required: true })}
              >
                <option value="">Select Medicine</option>
                {medicines
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
              </Form.Control>
              {errors.medication_id && (
                <p className="text-danger small">Medicine is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
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
            <Form.Group>
              <Form.Label>Order Type</Form.Label>
              <Form.Control
                as="select"
                {...register("shipping", { required: true })}
              >
                <option value="">Select Order Type</option>
                <option value="Shipping">Shipping</option>
                <option value="Pickup">Pickup</option>
              </Form.Control>
              {errors.shipping && (
                <p className="text-danger small">Order Type is required</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UpdateOrder;
