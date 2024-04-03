import React, { useState } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CreateUser = ({ show }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [serverResponse, setServerResponse] = useState(null);

  const submitForm = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

      const body = {
        name: data.name,
        manufacturer: data.manufacturer,
        category: data.category,
        price: parseFloat(data.price),
        stock_quantity: parseInt(data.stock_quantity),
        expiry_date: data.expiry_date,
        description: data.description,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch("/medicines/medications", requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        setServerResponse(responseData.message);
        reset();
        window.location.reload();
      } else {
        serverResponse(responseData.message);
        throw new Error(responseData.message || "Failed to create medicine");
      }
    } catch (error) {
      console.error("Error creating medicine:", error);
      setServerResponse(error.message);
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
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-danger small">Name is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Manufacturer"
                {...register("manufacturer", { required: true })}
              />
              {errors.manufacturer && (
                <p className="text-danger small">Manufacturer is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                {...register("category", { required: true })}
              />
              {errors.category && (
                <p className="text-danger small">Category is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Price"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="text-danger small">Price is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Stock Quantity"
                {...register("stock_quantity", { required: true })}
              />
              {errors.stock_quantity && (
                <p className="text-danger small">Stock Quantity is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Expiry Date"
                {...register("expiry_date", { required: true })}
              />
              {errors.expiry_date && (
                <p className="text-danger small">Expiry Date is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-danger small">Description is required</p>
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

export default CreateUser;
