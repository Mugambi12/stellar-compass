import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Card, Row, Col } from "react-bootstrap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contact_info, setContactInfo] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  const submitForm = () => {
    console.log("Form submitted");
    console.log(username);
    console.log(email);
    console.log(address);
    console.log(contact_info);
    console.log(password);
    console.log(confirm_password);

    setUsername("");
    setEmail("");
    setAddress("");
    setContactInfo("");
    setPassword("");
    setConfirmPassword("");
  };

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
                    value={username}
                    name="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    name="email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    name="address"
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Contact Info</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact info"
                    value={contact_info}
                    name="contact_info"
                    onChange={(e) => {
                      setContactInfo(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
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
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label className="mb-2">Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirm_password}
                    name="confirm_password"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <br />

            <Form.Group>
              <Button
                as="sub"
                variant="primary"
                type="submit"
                onClick={submitForm}
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
