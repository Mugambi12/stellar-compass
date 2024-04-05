import React, { useEffect, useState } from "react";
import { Spinner, Table, Row, Col } from "react-bootstrap";
import { EyeOutline, TrashOutline, AddOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import CreateUser from "../utils/CreateUser";
import UpdateUser from "../utils/UpdateUser";
import DeleteUser from "../utils/DeleteUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/users/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .finally(() => setIsLoading(false));
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type, user) => {
    setSelectedUser(user);
    setModalType(type);
    setShow(true);
  };

  const getModalTitle = (type) => {
    switch (type) {
      case "add":
        return "Add New User";
      case "update":
        return "Update User";
      case "delete":
        return "Delete User";
      default:
        return "";
    }
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
            <h4 className="mt-3 mb-1">Users Management</h4>
            <p className="text-muted mb-0">List of all registered users</p>
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

      <Table responsive borderless hover variant="light">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th>Created At</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Contact Info</th>
            <th>Role</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.reverse().map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.contact_info}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
              <td>{user.is_active ? "Active" : "Inactive"}</td>
              <td>
                <EyeOutline
                  className="me-1"
                  color={"#0096ff"}
                  onClick={() => handleShow("update", user)}
                  style={{ cursor: "pointer" }}
                />
                <TrashOutline
                  className="ms-2"
                  color={"#ff0000"}
                  onClick={() => handleShow("delete", user)}
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
          title={getModalTitle(modalType)}
        >
          {modalType === "add" && <CreateUser show={modalType === "add"} />}

          {modalType === "update" && (
            <UpdateUser show={modalType === "update"} user={selectedUser} />
          )}

          {modalType === "delete" && (
            <DeleteUser show={modalType === "delete"} user={selectedUser} />
          )}
        </CenterModal>
      )}
    </div>
  );
};

export default Users;
