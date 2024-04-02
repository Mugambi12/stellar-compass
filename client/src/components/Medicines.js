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
        <Modal.Title>Medicines Modal</Modal.Title>
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

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetch("/medicines/medications")
      .then((response) => response.json())
      .then((data) => setMedicines(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Card.Title className="mt-3 mb-2">Medicines Inventory</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all available medicines
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>description</th>
            <th>dosage</th>
            <th>manufacturer</th>
            <th>expiry_date</th>
            <th>category</th>
            <th>price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.id}</td>
              <td>{medicine.name}</td>
              <td>{medicine.description}</td>
              <td>{medicine.dosage}</td>
              <td>{medicine.manufacturer}</td>
              <td>{medicine.expiry_date}</td>
              <td>{medicine.category}</td>
              <td>{medicine.price}</td>
              <td>{medicine.stock_quantity}</td>
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

export default Medicines;
