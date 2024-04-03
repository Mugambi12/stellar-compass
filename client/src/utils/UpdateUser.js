import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const UpdateUser = ({ show, user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("password", user.password);
      setValue("contact_info", user.contact_info);
      setValue("role", user.role);
      setValue("is_active", user.is_active.toString());
      setValue("address", user.address);
    }

    setIsLoading(false);
  }, [user, setValue]);

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
      const response = await fetch(`/users/users/${user.id}`, requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error updating user. Please try again later.");
        console.error("Error updating user: " + responseData.message);
      }
    } catch (error) {
      setServerResponse("Error updating user. Please try again later.");
      console.error("Error updating user:", error);
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
              <Form.Label>Role</Form.Label>
              <Form.Select {...register("role", { required: true })}>
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </Form.Select>
              {errors.role && (
                <p className="text-danger small">Role is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Is Active</Form.Label>
              <Form.Select {...register("is_active", { required: true })}>
                <option value="">Select Status</option>
                <option value="true">Active</option>
                <option value="false">Passive</option>
              </Form.Select>
              {errors.is_active && (
                <p className="text-danger small">Is Active is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Contact Info"
                {...register("contact_info", { required: true })}
              />
              {errors.contact_info && (
                <p className="text-danger small">Contact Info is required</p>
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

          <Col md={12} className="mb-3">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                as={"textarea"}
                placeholder="Enter Address"
                {...register("address", { required: true })}
              />
              {errors.address && (
                <p className="text-danger small">Address is required</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateUser;
