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
        <Modal.Title>Sales Modal</Modal.Title>
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

const Invoices = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("/sales/sales")
      .then((response) => response.json())
      .then((data) => setSales(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Card.Title className="mt-3 mb-2">Invoice Records</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all completed invoices
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>customer_order_id</th>
            <th>amount</th>
            <th>payment_method</th>
            <th>transaction_id</th>
            <th>active_sale</th>
            <th>due_date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.name}</td>
              <td>{sale.customer_order_id}</td>
              <td>{sale.amount}</td>
              <td>{sale.payment_method}</td>
              <td>{sale.transaction_id}</td>
              <td>{sale.active_sale}</td>
              <td>{sale.due_date}</td>
              <td>{sale.status}</td>
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

export default Invoices;
