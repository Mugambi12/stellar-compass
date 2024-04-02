import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DeleteOrder = ({ show }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    console.log(data);

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    console.log(token);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data),
    };

    fetch("/orders/orders", requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <h1>update order</h1>
    </div>
  );
};

export default DeleteOrder;
