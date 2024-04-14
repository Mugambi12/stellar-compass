import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

const SelectField = ({ label, register, options, name, errors }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control as="select" {...register(name, { required: true })}>
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name || option.username}
        </option>
      ))}
    </Form.Control>
    {errors[name] && <p className="text-danger small">{label} is required</p>}
  </Form.Group>
);

const TextField = ({ label, register, name, errors, placeholder }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type="text"
      placeholder={placeholder}
      {...register(name, { required: true })}
    />
    {errors[name] && <p className="text-danger small">{label} is required</p>}
  </Form.Group>
);

const CreateNewOrder = ({ show }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [serverResponse, setServerResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchMedicines();
    setIsLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/users/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await fetch("/medicines/medications");
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const handleDeferredPayment = async (data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

      const medicationResponse = await fetch(
        `/medicines/medications/${data.medication_id}`
      );
      const medicationData = await medicationResponse.json();
      const price = medicationData.price;

      const total_price = price * data.quantity;

      const body = {
        user_id: data.user_id,
        medication_id: data.medication_id,
        quantity: data.quantity,
        shipping: data.shipping,
        total_price: total_price,
      };

      console.log("body", body);

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
        //reset();
        //window.location.reload();
      } else {
        setServerResponse(responseData.message);
        throw new Error(responseData.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setServerResponse(error.message);
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

  const processDeferredPayment = async (response, data) => {
    try {
      const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

      const medicationResponse = await fetch(
        `/medicines/medications/${data.medication_id}`
      );
      const medicationData = await medicationResponse.json();
      const price = medicationData.price;

      const total_price = price * data.quantity;

      const body = {
        amount: total_price,
        payment_method: "flutterwave",
        transaction_id: response.transaction_id,
        status: "Paid",
        response_status: response.status,
        response_amount: response.amount,
        response_charge_response_code: response.charge_response_code,
        response_charge_response_message: response.charge_response_message,
        response_charged_amount: response.charged_amount,
        response_currency: response.currency,
        response_flw_ref: response.flw_ref,
        response_transaction_id: response.transaction_id,
        response_tx_ref: response.tx_ref,
        response_customer_email: response.customer_email,
        response_customer_name: response.customer_name,
        response_customer_phone_number: response.customer_phone_number,
      };

      console.log("body", body);
      console.log("response", response);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      const paymentResponse = await fetch("/payments/payments", requestOptions);
      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok) {
        setServerResponse(paymentData.message);
      } else {
        setServerResponse(paymentData.message);
        throw new Error(paymentData.message || "Failed to create payment");
      }

      console.log("Payment response", paymentData);
    } catch (error) {
      console.error("Error creating payment:", error);
      setServerResponse(error.message);
    }
  };

  const handleImmediatePayment = async (data) => {
    try {
      const selectedUser = users.find((user) => user.id == data.user_id);
      const selectedMedicine = medicines.find(
        (medicine) => medicine.id == data.medication_id
      );

      config.customer.email = selectedUser.email;
      config.customer.phone_number = selectedUser.contact_info;
      config.customer.name = selectedUser.username;
      config.amount = selectedMedicine.price * data.quantity;

      handleFlutterPayment({
        callback: async (response) => {
          closePaymentModal();

          console.log("Payment response", response);

          if (response.status === "successful") {
            try {
              await processDeferredPayment(response, data);
              await handleDeferredPayment(data);

              console.log("Payment was successful");
            } catch (error) {
              console.error("Error:", error);
            }
          } else {
            console.log("Payment was not successful");
          }
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-auto">
        <Spinner animation="border" variant="info" />{" "}
        <span className="ms-3"> Loading...</span>
      </div>
    );
  }

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
            <SelectField
              label="User"
              register={register}
              options={users}
              name="user_id"
              errors={errors}
            />
          </Col>

          <Col md={6} className="mb-3">
            <SelectField
              label="Medicine"
              register={register}
              options={medicines}
              name="medication_id"
              errors={errors}
            />
          </Col>

          <Col md={6} className="mb-3">
            <TextField
              label="Quantity"
              register={register}
              name="quantity"
              errors={errors}
              placeholder="Enter Quantity"
            />
          </Col>

          <Col md={6} className="mb-3">
            <SelectField
              label="Order Type"
              register={register}
              options={[
                { id: 1, name: "Shipping" },
                { id: 2, name: "Pickup" },
              ]}
              name="shipping"
              errors={errors}
            />
          </Col>
        </Row>

        <Row className="justify-content-around">
          <Col xs={6} md={4} className="mb-3">
            <Button
              variant="success"
              block
              className="w-100"
              onClick={handleSubmit(handleImmediatePayment)}
            >
              Pay Now
            </Button>
          </Col>

          <Col xs={6} md={4}>
            <Button
              variant="primary"
              block
              className="w-100"
              onClick={handleSubmit(handleDeferredPayment)}
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
