import React, { useEffect, useState } from "react";
import { Spinner, Table, Row, Col } from "react-bootstrap";
import { EyeOutline, AddOutline, TrashOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import CreateNewOrder from "../utils/CreateNewOrder";
import UpdateOrder from "../utils/UpdateOrder";
import DeleteOrder from "../utils/DeleteOrder";

const OrdersMade = () => {
  const [ordersMade, setOrdersMade] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [users, setUsers] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersResponse, medicinesResponse, usersResponse] =
          await Promise.all([
            fetch("/orders/orders"),
            fetch("/medicines/medications"),
            fetch("/users/users"),
          ]);
        const [ordersData, medicinesData, usersData] = await Promise.all([
          ordersResponse.json(),
          medicinesResponse.json(),
          usersResponse.json(),
        ]);
        setOrdersMade(ordersData);
        setMedicines(medicinesData);
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type, order) => {
    setSelectedOrder(order);
    setModalType(type);
    setShow(true);
  };

  const getMedicineName = (medicationId) => {
    const medicine = medicines.find((medicine) => medicine.id === medicationId);
    return medicine ? medicine.name : "Unknown Medicine";
  };

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "Unknown User";
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

  if (isLoading) {
    return (
      <div className="text-center">
        {" "}
        <Spinner animation="border" /> Loading...{" "}
      </div>
    );
  }

  return (
    <div className="container-fluid">
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
            <th>User Name</th>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Total Price</th>
            <th>Order Type</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ordersMade.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{getUserName(order.user_id)}</td>
              <td>{getMedicineName(order.medication_id)}</td>
              <td>{order.quantity}</td>
              <td>{order.total_price}</td>
              <td>{order.order_type ? "Shipping" : "Pickup"}</td>
              <td>{order.status}</td>
              <td>{order.payment_status}</td>
              <td>
                {/* Action icons */}
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

      {/* Modal */}
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
