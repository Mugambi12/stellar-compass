import React, { useEffect, useState } from "react";
import { Table, Card, Button, Modal } from "react-bootstrap";
import { EyeOutline } from "react-ionicons";

const centerModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      {...props}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Payments Modal</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        I will not close if you click outside me. Do not even try to press the
        escape key.
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button size="sm" variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button size="sm" variant="primary">
          Understood
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/payments/payments")
      .then((response) => response.json())
      .then((data) => setPayments(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Card.Title className="mt-3 mb-2">Payments</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all payment transactions
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Invoice ID</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Transaction ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.name}</td>
              <td>{payment.invoice_id}</td>
              <td>{payment.amount}</td>
              <td>{payment.payment_method}</td>
              <td>{payment.transaction_id}</td>
              <td>{payment.status}</td>

              <td className="text-center">
                <EyeOutline color={"#0096ff"} onClick={handleShow} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {centerModal({ show, handleClose })}
    </div>
  );
};

export default Payments;
