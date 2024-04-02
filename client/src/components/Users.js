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
        <Modal.Title>Users Modal</Modal.Title>
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

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
      <Card.Title className="mt-3 mb-2">All Users</Card.Title>
      <Card.Subtitle className="mb-3 text-muted">
        List of all registered users
      </Card.Subtitle>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>{user.contact_info}</td>
              <td>{user.role}</td>
              <td>{user.address}</td>
              <td>{user.is_active ? "Active" : "Inactive"}</td>
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

export default Users;
