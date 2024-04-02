import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "react-bootstrap";
import { EyeOutline, AddOutline, TrashOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";

const OrdersMade = () => {
  const [ordersMade, setOrdersMade] = useState([]);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetch("/orders/orders")
      .then((response) => response.json())
      .then((data) => setOrdersMade(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (type) => {
    setShow(true);
    setModalType(type);
  };

  const getModalTitle = (type) => {
    switch (type) {
      case "add":
        return "Add Order";
      case "update":
        return "Update Order";
      case "delete":
        return "Delete Order";
      default:
        return "";
    }
  };

  const getActionText = (type) => {
    switch (type) {
      case "add":
        return "Add";
      case "update":
        return "Update";
      case "delete":
        return "Delete";
      default:
        return "";
    }
  };

  return (
    <div className="container">
      <Row className="align-items-center mb-4">
        <Col xs={8}>
          <div className="mb-2">
            <h4 className="mt-3 mb-1">All Orders</h4>
            <p className="text-muted mb-0">List of all orders placed</p>
          </div>
        </Col>
        <Col xs={4} className="text-end">
          <AddOutline
            color="#0096ff"
            onClick={() => handleShow("add")}
            style={{ cursor: "pointer", fontSize: "24px" }}
          />
        </Col>
      </Row>

      <Table
        responsive
        borderless
        hover
        variant="light"
        className="text-center"
      >
        <thead>
          <tr>
            <th Col>Id</th>
            <th Col>Name</th>
            <th Col>User ID</th>
            <th Col>Medicine ID</th>
            <th Col>Quantity</th>
            <th Col>Total Price</th>
            <th Col>Order Type</th>
            <th Col>Payment</th>
            <th Col>Status</th>
            <th Col>Actions</th>
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
                <EyeOutline
                  style={{ cursor: "pointer", color: "#0096ff" }}
                  onClick={() => handleShow("update")}
                />

                <TrashOutline
                  className="ms-2"
                  style={{ cursor: "pointer", color: "#ff0000" }}
                  onClick={() => handleShow("delete")}
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
          title={getModalTitle(modalType)}
          actionText={getActionText(modalType)}
          handleAction={() => {
            // Logic to handle action based on modalType
            console.log(`Handling ${modalType} action...`);
          }}
        >
          {/* Modal content based on modalType */}
          {modalType === "add" && <p>Add Order Form</p>}
          {modalType === "update" && <p>Update Order Form</p>}
          {modalType === "delete" && <p>Confirm Deletion</p>}
        </CenterModal>
      )}
    </div>
  );
};

export default OrdersMade;
