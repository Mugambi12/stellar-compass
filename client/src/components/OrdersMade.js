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
        <Modal.Title>Orders Modal</Modal.Title>
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

const OrdersMade = () => {
  const [ordersMade, setOrdersMade] = useState([]);

  useEffect(() => {
    fetch("/orders/orders")
      .then((response) => response.json())
      .then((data) => setOrdersMade(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Card.Title className="mt-3 mb-2">All Orders</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all orders placed
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>User ID</th>
            <th>Medicine ID</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Order Type</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ordersMade.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.user_id}</td>
              <td>{order.medication_id}</td>
              <td>{order.quantity}</td>
              <td>{order.total_price}</td>
              <td>{order.order_type}</td>
              <td>{order.payment_status}</td>
              <td>{order.status}</td>
              <td>
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

export default OrdersMade;
