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
        username: data.username,
        email: data.email,
        password: data.password,
        address: data.address,
        contact_info: data.contact_info,
        role: data.role,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch("/users/users", requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        setServerResponse(responseData.message);
        reset();
        window.location.reload();
      } else {
        serverResponse(responseData.message);
        throw new Error(responseData.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
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
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                {...register("name")}
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p className="text-danger small">Username is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-danger small">Email is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-danger small">Password is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Contact Info"
                {...register("contact_info", {
                  required: true,
                  maxLength: 20,
                  minLength: 10,
                })}
              />

              {errors.contact_info && (
                <p className="text-danger small">Contact Info is required</p>
              )}
              {errors.contact_info?.type === "maxLength" && (
                <p className="text-danger small">
                  Contact Info is too long. Max 20 characters
                </p>
              )}
              {errors.contact_info?.type === "minLength" && (
                <p className="text-danger small">
                  Contact Info is too short. Min 10 characters
                </p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                {...register("role", { required: true })}
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </Form.Control>
              {errors.role && (
                <p className="text-danger small">Role is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                as={"textarea"}
                placeholder="Enter Address"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-danger small">Address is required</p>
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
