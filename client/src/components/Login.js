import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { login } from "../auth";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const navigate = useNavigate();

  const loginUser = (data) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch("/auth/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          login(data.access_token);
          navigate("/orders");
        } else {
          setServerResponse(data.message);
          setShow(true);
        }
      });
  };

  return (
    <div className="container mt-5">
      <Card className="p-4 col-md-5 mx-auto">
        <div className="text-center mb-4">
          <h3>Welcome to Utibu Health</h3>
          <p className="text-muted">Happy to see you back</p>
        </div>
        {show && (
          <Alert variant="danger" onClose={() => setShow(false)} dismissible>
            <Alert.Heading>Login Failed!</Alert.Heading>
            <p>{serverResponse}</p>
          </Alert>
        )}
        <Form onSubmit={handleSubmit(loginUser)}>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              {...register("username", { required: true, maxLength: 50 })}
            />
            {errors.username && (
              <Form.Text className="text-danger">
                Username is required
              </Form.Text>
            )}
            {errors.username?.type === "maxLength" && (
              <Form.Text className="text-danger">
                Username is too long. Max 50 characters
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password && (
              <Form.Text className="text-danger">
                Password is required
              </Form.Text>
            )}
            {errors.password?.type === "minLength" && (
              <Form.Text className="text-danger">
                Password is too short. Min 8 characters
              </Form.Text>
            )}
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mt-4 mb-2 py-3 w-100 fs-5 bg-gradient border-0"
          >
            Login
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small>
            Don't have an account? <Link to="/register">Get Started</Link>
          </small>
        </div>
      </Card>
    </div>
  );
};

export default Login;
