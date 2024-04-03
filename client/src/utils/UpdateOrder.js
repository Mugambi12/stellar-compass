// UpdateOrder.js
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const UpdateOrder = ({ show, order }) => {
  const orderToDeleteId = order.id;

  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (order) {
      setValue("quantity", order.quantity);
      setValue("order_type", order.order_type ? "Shipping" : "Pickup");
    }
  }, [order]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medicineResponse = await fetch("/medicines/medications");
        const userDataResponse = await fetch("/users/users");
        const medicineData = await medicineResponse.json();
        const userData = await userDataResponse.json();
        setMedicines(medicineData);
        setUsers(userData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (order) {
      setValue("user_id", order.user_id);
      setValue("medication_id", order.medication_id);
    }
  }, [order, setValue]);

  const updateForm = async (data) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(
      `/orders/orders/${orderToDeleteId}`,
      requestOptions
    );
    const responseData = await response.json();

    if (response.ok) {
      reset();
      window.location.reload();
    } else {
      console.error("Error updating order:", responseData);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <Form onSubmit={handleSubmit(updateForm)}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select {...register("user_id", { required: true })}>
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Select>
              {errors.user_id && (
                <p className="text-danger small">User is required</p>
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
          Update
        </Button>
      </Form>
    </div>
  );
};

export default UpdateOrder;
