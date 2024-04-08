import React, { useEffect, useState } from "react";
import { Spinner, Table, Card } from "react-bootstrap";
import { CashOutline, CloseCircleOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import MakePayment from "../utils/MakePayment";
import CancelPayment from "../utils/CancelPayment";

const Invoices = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/payments/payments");
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type, payment) => {
    setSelectedPayment(payment);
    setModalType(type);
    setShow(true);
  };

  const handlePay = (type, payment) => {
    setSelectedPayment(payment);
    setModalType(type);
    setShow(true);
    console.log("Redirect to payment API");
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="info" />{" "}
        <span className="ms-3"> Loading...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Card.Title className="mt-3 mb-2">Invoice Records</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all completed invoices
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Order Date</th>
            <th>User Name</th>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Order Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.reverse().map((payment, index) => (
            <tr key={payment.id}>
              <td>{index + 1}</td>
              <td>{new Date(payment.created_at).toLocaleDateString()}</td>
              <td>{payment.response_customer_name}</td>
              <td>{payment.response_customer_email}</td>
              <td>{payment.amount}</td>
              <td>{payment.status}</td>
              <td>{payment.payment_method}</td>
              <td>
                <CashOutline
                  className="me-1"
                  color={"#00cc00"}
                  onClick={() => handlePay("pay", payment)}
                  style={{ cursor: "pointer" }}
                />
                <CloseCircleOutline
                  className="ms-2"
                  color={"#ff0000"}
                  onClick={() => handleShow("cancel", payment)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {modalType && (
        <CenterModal
          show={show}
          handleClose={handleClose}
          title={modalType === "pay" ? "Make Payment" : "Cancel Payment"}
        >
          {modalType === "pay" && (
            <MakePayment show={modalType === "pay"} payment={selectedPayment} />
          )}
          {modalType === "cancel" && (
            <CancelPayment
              show={modalType === "cancel"}
              payment={selectedPayment}
            />
          )}
        </CenterModal>
      )}
    </div>
  );
};

export default Invoices;
