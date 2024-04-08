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
  }, []);

  useEffect(() => {
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

  const config = {
    public_key: "FLWPUBK_TEST-04ca5c2cd148e5803fb311c0bfd1c511-X",
    tx_ref: Date.now(),
    amount: 0,
    currency: "KES",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: "",
      phone_number: "",
      name: "",
    },
    customizations: {
      title: "Payment to Apogen Pharmacy",
      description: "Payment for items in submitForm data",
      logo: "shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayLater = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
      const orderType = data.shipping === "Shipping";

      const body = {
        user_id: parseInt(data.user_id),
        medication_id: parseInt(data.medication_id),
        quantity: parseInt(data.quantity),
        shipping: orderType,
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
        throw new Error(responseData.message); // Throw error for unsuccessful response
      }
    } catch (error) {
      console.error("Error submitting order:", error.message);
      setServerResponse("Error submitting order: " + error.message); // Set error message in state
    }
  };

  const handlePayNow = async (data) => {
    try {
      for (let user of users) {
        if (user.id == data.user_id) {
          console.log("username:", user.username);
          config.customer.email = user.email;
          config.customer.phone_number = user.contact_info;
          config.customer.name = user.username;
          break;
        }
      }

      for (let medicine of medicines) {
        if (medicine.id == data.medication_id) {
          console.log("medicine price:", medicine.price);
          config.amount = medicine.price * data.quantity;
          break;
        }
      }

      handleFlutterPayment({
        callback: async (response) => {
          closePaymentModal();

          const orderType = data.shipping === "Shipping";

          const body = {
            user_id: parseInt(data.user_id),
            medication_id: parseInt(data.medication_id),
            quantity: parseInt(data.quantity),
            shipping: orderType,

            response_status: response.status,
            response_amount: response.amount,
            response_code: response.charge_response_code,
            response_message: response.charge_response_message,
            response_charged_amount: response.charged_amount,
            response_currency: response.currency,
            response_flw_ref: response.flw_ref,
            response_transaction_id: response.transaction_id,
            response_tx_ref: response.tx_ref,
            response_customer_email: response.customer.email,
            response_customer_name: response.customer.name,
            response_customer_phone_number: response.customer.phone_number,
          };

          if (response.status === "successful") {
            await handlePayLater(data);
            console.log("Payment was successful");
            try {
              const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

              console.log("This is body:", body);

              const requestOptions = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${JSON.parse(token)}`,
                },
                body: JSON.stringify(body),
              };

              const paymentResponse = await fetch(
                "/payments/payments",
                requestOptions
              );
              const paymentData = await paymentResponse.json();
              console.log("Payment response:", paymentData);

              if (paymentResponse.ok) {
                reset();
                window.location.reload();
              } else {
                throw new Error(paymentData.message); // Throw error for unsuccessful payment
              }
              setServerResponse(paymentData.message);
            } catch (error) {
              console.error("Error submitting payment:", error.message);
              setServerResponse("Error submitting payment: " + error.message); // Set error message in state
            }
          } else {
            setServerResponse("Payment was unsuccessful");
            console.log("Payment was unsuccessful");
            window.location.href = "/orders";
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
              <Form.Control
                as="select"
                {...register("user_id", { required: true })}
              >
                <option value="">Select User</option>
                {users
                  .slice()
                  .sort((a, b) => a.username.localeCompare(b.username))
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
              </Form.Control>
              {errors.user_id && (
                <p className="text-danger small">User is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Medicine</Form.Label>
              <Form.Control
                as="select"
                {...register("medication_id", { required: true })}
              >
                <option value="">Select Medicine</option>
                {medicines
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((medicine) => (
                    <option key={medicine.id} value={medicine.id}>
                      {medicine.name}
                    </option>
                  ))}
              </Form.Control>
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
              <Form.Control
                as="select"
                {...register("shipping", { required: true })}
              >
                <option value="">Select Order Type</option>
                <option value="Shipping">Shipping</option>
                <option value="Pickup">Pickup</option>
              </Form.Control>
              {errors.shipping && (
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
