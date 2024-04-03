// OrdersMade.js
import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "react-bootstrap";
import { EyeOutline, AddOutline, TrashOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import CreateNewOrder from "../utils/CreateNewOrder";
import UpdateOrder from "../utils/UpdateOrder";
import DeleteOrder from "../utils/DeleteOrder";

const OrdersMade = () => {
  const [ordersMade, setOrdersMade] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/orders/orders")
      .then((response) => response.json())
      .then((data) => setOrdersMade(data));
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type, order) => {
    setSelectedOrder(order);
    setModalType(type);
    setShow(true);
  };

  const getModalTitle = (type) => {
    switch (type) {
      case "add":
        return "Add New Order";
      case "update":
        return "Update Order";
      case "delete":
        return "Delete Order";
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
            <th>ID</th>
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
              <td>{order.order_type ? "Shipping" : "Pickup"}</td>
              <td>{order.payment_status}</td>
              <td>{order.status}</td>
              <td>
                <EyeOutline
                  style={{ cursor: "pointer", color: "#0096ff" }}
                  onClick={() => {
                    handleShow("update", order);
                  }}
                />

                <TrashOutline
                  className="ms-2"
                  style={{ cursor: "pointer", color: "#ff0000" }}
                  onClick={() => {
                    handleShow("delete", order);
                  }}
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
        >
          {modalType === "add" && <CreateNewOrder show={modalType === "add"} />}

          {modalType === "update" && (
            <UpdateOrder show={modalType === "update"} order={selectedOrder} />
          )}

          {modalType === "delete" && (
            <DeleteOrder show={modalType === "delete"} order={selectedOrder} />
          )}
        </CenterModal>
      )}
    </div>
  );
};

export default OrdersMade;
