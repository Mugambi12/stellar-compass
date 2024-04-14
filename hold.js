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

  const handlePayNow = async (data) => {
    try {
      // Prepare payment configuration based on user and medicine data
      const selectedUser = users.find((user) => user.id == data.user_id);
      const selectedMedicine = medicines.find(
        (medicine) => medicine.id == data.medication_id
      );

      config.customer.email = selectedUser.email;
      config.customer.phone_number = selectedUser.contact_info;
      config.customer.name = selectedUser.username;
      config.amount = selectedMedicine.price * data.quantity;

      // Initiate payment with Flutterwave
      handleFlutterPayment({
        callback: async (response) => {
          closePaymentModal();
          try {
            const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

            const body = {
              // Construct payment response data
              // (You might need to adjust this based on your backend API)
              response_status: response.status,
              response_amount: response.amount,
              response_charge_response_code: response.charge_response_code,
              response_charge_response_message:
                response.charge_response_message,
              response_charged_amount: response.charged_amount,
              response_currency: response.currency,
              response_flw_ref: response.flw_ref,
              response_transaction_id: response.transaction_id,
              response_tx_ref: response.tx_ref,
              response_customer_email: response.customer.email,
              response_customer_name: response.customer.name,
              response_customer_phone_number: response.customer.phone_number,
            };

            const requestOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(token)}`,
              },
              body: JSON.stringify(body),
            };

            // Send payment data to backend
            const paymentResponse = await fetch(
              "/payments/payments",
              requestOptions
            );
            const paymentData = await paymentResponse.json();

            if (paymentResponse.ok) {
              reset(); // Reset form on successful payment
              window.location.reload(); // Reload page
            } else {
              throw new Error(paymentData.message); // Throw error for unsuccessful payment
            }
            setServerResponse(paymentData.message);
          } catch (error) {
            console.error("Error submitting payment:", error.message);
            setServerResponse("Error submitting payment: " + error.message); // Set error message in state
          }
        },
        onClose: () => {
          console.log("Payment closed by user");
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePayLater = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

      const body = {
        user_id: parseInt(data.user_id),
        medication_id: parseInt(data.medication_id),
        quantity: parseInt(data.quantity),
        shipping: data.shipping === "Shipping" ? true : false,
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
        setServerResponse(responseData.message);
        reset();
        window.location.reload();
      } else {
        setServerResponse(responseData.message || "Failed to create the order");
        throw new Error(responseData.message || "Failed to create the order");
      }
    } catch (error) {
      console.error("Error creating the order:", error);
      setServerResponse(error.message);
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
                {users.map((user) => (
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
                {medicines.map((medicine) => (
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
