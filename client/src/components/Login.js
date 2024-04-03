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
          navigate("/users");
        } else {
          setServerResponse(data.message);
          setShow(true);
        }
      });
  };

  return (
    <div className="container mt-5">
      <Card className="p-3 col-md-7 mx-auto">
        <h3 className="text-center mb-3">Welcome to Utibu Health</h3>

        {show ? (
          <>
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
              <Alert.Heading>Login Failed!</Alert.Heading>
              <p>{serverResponse}</p>
            </Alert>
          </>
        ) : null}

        <div className="form">
          <Form onSubmit={handleSubmit(loginUser)}>
            <Col className="mb-3">
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
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-2">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  {...register("password", { required: true, minLength: 8 })}
                />

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

            <Button variant="primary" type="submit">
              Login
            </Button>

            <br />

            <Form.Group>
              <small>
                Do not have an account? <Link to="/register"> Get Started</Link>
              </small>
            </Form.Group>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
