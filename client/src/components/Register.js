import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import PasswordToggle from "../utils/PasswordToggle";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submitForm = (data) => {
    if (data.password === data.confirm_password) {
      const body = {
        username: data.username,
        email: data.email,
        address: data.address,
        contact_info: data.contact_info,
        password: data.password,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };

      fetch("/auth/signup", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setServerResponse(data.message);
          setShow(true);
          console.log(serverResponse);
        })
        .catch((error) => console.log(error));

      reset();
    } else {
      alert("Passwords do not match");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container mt-5">
      <Card className="p-3 col-md-8 mx-auto bg-transparent border-0 shadow-sm">
        <h3 className="text-center mb-3">Create an Account</h3>

        {show ? (
          <>
            <Alert variant="success" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Registration Successful!</Alert.Heading>
              <p>{serverResponse}</p>
            </Alert>
          </>
        ) : null}

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
                <Form.Label className="mb-2">Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter contact info"
                  {...register("contact_info", {
                    required: true,
                    maxLength: 20,
                    minLength: 10,
                  })}
                />

                {errors.contact_info && (
                  <p className="text-danger small">Contact info is required</p>
                )}
                {errors.contact_info?.type === "maxLength" && (
                  <p className="text-danger small">
                    Contact info is too long. Max 100 characters
                  </p>
                )}
                {errors.contact_info?.type === "minLength" && (
                  <p className="text-danger small">
                    Contact info is too short. Min 10 characters
                  </p>
                )}
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="mb-2">Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    {...register("password", { required: true, minLength: 8 })}
                  />
                  <PasswordToggle
                    showPassword={showPassword}
                    togglePassword={togglePasswordVisibility}
                  />
                </div>
                {errors.password && (
                  <p className="text-danger small">Password is required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-danger small">
                    Password is too short. Min 8 characters
                  </p>
                )}
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="mb-2">Confirm Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    {...register("confirm_password", {
                      required: true,
                      minLength: 6,
                    })}
                  />
                  <PasswordToggle
                    showPassword={showConfirmPassword}
                    togglePassword={toggleConfirmPasswordVisibility}
                  />
                </div>
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
              className="mt-4 mb-2 py-3 w-100 fs-5 bg-gradient border-0"
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
      </Card>
    </div>
  );
};

export default Register;
