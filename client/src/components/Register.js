import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    console.log(data);
    reset();
  };

  console.log(watch("username"));
  console.log(watch("email"));
  console.log(watch("address"));
  console.log(watch("contact_info"));
  console.log(watch("password"));
  console.log(watch("confirm_password"));

  return (
    <div className="container mt-5">
      <Card className="p-3 col-md-8 mx-auto">
        <h3 className="text-center mb-3">Create an Account</h3>
        <div className="form">
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    {...register("username", { required: true, maxLength: 50 })}
                  />

                  {errors.username && (
                    <p className="text-danger small">Username is required</p>
                  )}
                  {errors.username?.type === "maxLength" && (
                    <p className="text-danger small">
                      Username is too long. Max 50 characters
                    </p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    {...register("email", {
                      required: true,
                      maxLength: 100,
                    })}
                  />

                  {errors.email && (
                    <p className="text-danger small">Email is required</p>
                  )}
                  {errors.email?.type === "maxLength" && (
                    <p className="text-danger small">
                      Email is too long. Max 100 characters
                    </p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    {...register("address", {
                      required: true,
                    })}
                  />

                  {errors.address && (
                    <p className="text-danger small">Address is required</p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Contact Info</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact info"
                    {...register("contact_info", {
                      required: true,
                      maxLength: 100,
                    })}
                  />

                  {errors.contact_info && (
                    <p className="text-danger small">
                      Contact info is required
                    </p>
                  )}
                  {errors.contact_info?.type === "maxLength" && (
                    <p className="text-danger small">
                      Contact info is too long. Max 100 characters
                    </p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register("password", { required: true, minLength: 6 })}
                  />

                  {errors.password && (
                    <p className="text-danger small">Password is required</p>
                  )}
                  {errors.password?.type === "minLength" && (
                    <p className="text-danger small">
                      Password is too short. Min 6 characters
                    </p>
                  )}
                </Form.Group>
              </Col>

              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    {...register("confirm_password", {
                      required: true,
                      minLength: 6,
                    })}
                  />

                  {errors.confirm_password && (
                    <p className="text-danger small">
                      Confirm password is required
                    </p>
                  )}
                  {errors.confirm_password?.type === "minLength" && (
                    <p className="text-danger small">
                      Confirm password is too short. Min 6 characters
                    </p>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <br />

            <Form.Group>
              <Button
                as="sub"
                variant="primary"
                type="submit"
                onClick={handleSubmit(submitForm)}
              >
                Sign Up
              </Button>
            </Form.Group>

            <br />

            <Form.Group>
              <small>
                Already have an account? <Link to="/"> Login</Link>
              </small>
            </Form.Group>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Register;