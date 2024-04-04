import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const CreateNewOrder = ({ show }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [serverResponse, setServerResponse] = useState(null);

  useEffect(() => {
    fetchMedicines();
    fetchUsers();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await fetch("/medicines/medications");
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/users/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePayLater = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
      const orderType = data.order_type === "Shipping";

      const body = {
        user_id: parseInt(data.user_id),
        medication_id: parseInt(data.medication_id),
        quantity: parseInt(data.quantity),
        order_type: orderType,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      const response = await fetch("/orders/orders", requestOptions);
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        console.error("Error submitting order:", responseData.message);
      }

      setServerResponse(responseData.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalPrice = 300;
  const email = "apogen@mail.com";
  const phone_number = "08012345678";
  const name = "Apogen Pharmacy";
  const title = "Payment to Apogen Pharmacy";
  const description = "Payment for items in submitForm data";
  const logo =
    "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg";

  const config = {
    public_key: "FLWPUBK_TEST-04ca5c2cd148e5803fb311c0bfd1c511-X",
    tx_ref: Date.now(),
    amount: totalPrice,
    currency: "KES",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: email,
      phone_number: phone_number,
      name: name,
    },
    customizations: {
      title: title,
      description: description,
      logo: logo,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayNow = async (data) => {
    try {
      handleFlutterPayment({
        callback: async (response) => {
          console.log("This is payment response", response);
          closePaymentModal(); // Close the modal programmatically

          if (response.status === "successful") {
            await handlePayLater(data); // Submit the form if payment successful
            console.log("Payment was successful");
            console.log("This is is data", data);
            console.log("This is payment response", response);
          } else {
            alert("Payment was unsuccessful");
            console.log("Payment was unsuccessful");
            window.location.href = "/users"; // Redirect if payment unsuccessful
          }
        },
        onClose: () => {
          // Handle modal closure if needed
          console.log("Payment closed by user");
        },
      });
    } catch (error) {
      console.error("Error:", error);
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

      <Form>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Select {...register("user_id", { required: true })}>
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Select>
              {errors.user_id && (
                <p className="text-danger small">User is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Medicine</Form.Label>
              <Form.Select {...register("medication_id", { required: true })}>
                <option value="">Select Medicine</option>
                {medicines.map((medicine) => (
                  <option key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </option>
                ))}
              </Form.Select>
              {errors.medication_id && (
                <p className="text-danger small">Medicine is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Quantity"
                {...register("quantity", { required: true })}
              />
              {errors.quantity && (
                <p className="text-danger small">Quantity is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Order Type</Form.Label>
              <Form.Select {...register("order_type", { required: true })}>
                <option value="">Select Order Type</option>
                <option value="Shipping">Shipping</option>
                <option value="Pickup">Pickup</option>
              </Form.Select>
              {errors.order_type && (
                <p className="text-danger small">Order Type is required</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-around">
          <Col xs={6} md={4} className="mb-3">
            <Button
              variant="primary"
              block
              className="w-100"
              onClick={handleSubmit(handlePayNow)}
            >
              Pay Now
            </Button>
          </Col>

          <Col xs={6} md={4}>
            <Button
              variant="success"
              block
              className="w-100"
              onClick={handleSubmit(handlePayLater)}
            >
              Pay Later
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateNewOrder;
