import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card, Col } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = (e) => {
    console.log("Form submitted");
    console.log(username);
    console.log(password);

    setUsername("");
    setPassword("");
  };

  return (
    <div className="container mt-5">
      <Card className="p-3 col-md-7 mx-auto">
        <h3 className="text-center mb-3">Welcome to Utibu Health</h3>
        <div className="form">
          <Form>
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-2">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  name="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
            <Col className="mb-3">
              <Form.Group>
                <Form.Label className="mb-2">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  name="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>

            <br />

            <Form.Group>
              <Button
                as="sub"
                variant="primary"
                type="submit"
                onClick={loginUser}
              >
                Login
              </Button>
            </Form.Group>

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
