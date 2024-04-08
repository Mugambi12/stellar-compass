import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner, Table, Row, Col } from "react-bootstrap";
import { CashOutline, CloseCircleOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import MakePayment from "../utils/MakePayment";
import CancelPayment from "../utils/CancelPayment";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("/orders/orders");
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

  useEffect(() => {
    const fetchAdditionalData = async () => {
      try {
        const [medicinesResponse, usersResponse] = await Promise.all([
          fetch("/medicines/medications"),
          fetch("/users/users"),
        ]);
        const [medicinesData, usersData] = await Promise.all([
          medicinesResponse.json(),
          usersResponse.json(),
        ]);
        setMedicines(medicinesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAdditionalData();
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

  const getMedicineName = (medicationId) => {
    const medicine = medicines.find((medicine) => medicine.id === medicationId);
    return medicine ? medicine.name : "Unknown Medicine";
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
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
      <Row className="align-items-center mb-4">
        <Col xs={8}>
          <div className="mb-2">
            <h4 className="mt-3 mb-1">Payments</h4>
            <p className="text-muted mb-0">List of pending payments</p>
          </div>
        </Col>
        <Col xs={4} className="text-end">
          <Link to="/invoices"> View Invoices </Link>
        </Col>
      </Row>

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
          {payments
            .reverse()
            //.filter((payment) => payment.status === "Confirmed")
            .map((payment, index) => (
              <tr key={payment.id}>
                <td>{index + 1}</td>
                <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                <td>{getUserName(payment.user_id)}</td>
                <td>{getMedicineName(payment.medication_id)}</td>
                <td>{payment.quantity}</td>
                <td>{payment.total_price}</td>
                <td>{payment.status}</td>
                <td>{payment.payment_status}</td>
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

export default Payments;
