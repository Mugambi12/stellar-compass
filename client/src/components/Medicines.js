import React, { useEffect, useState } from "react";
import { Spinner, Table, Row, Col } from "react-bootstrap";
import { EyeOutline, TrashOutline, AddOutline } from "react-ionicons";
import CenterModal from "../utils/Modal";
import CreateNewMedicine from "../utils/CreateNewMedicine";
import UpdateMedicine from "../utils/UpdateMedicine";
import DeleteMedicine from "../utils/DeleteMedicine";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [modalType, setModalType] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/medicines/medications")
      .then((response) => response.json())
      .then((data) => setMedicines(data));
    setIsLoading(false);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (type, medicine) => {
    setSelectedMedicine(medicine);
    setModalType(type);
    setShow(true);
  };

  const getModalTitle = (type) => {
    switch (type) {
      case "add":
        return "Add New Medicine";
      case "update":
        return "Update Medicine";
      case "delete":
        return "Delete Medicine";
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
            <h4 className="mt-3 mb-1">Medicines Inventory</h4>
            <p className="text-muted mb-0">List of all available medicines</p>
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
            <th>Id</th>
            <th>Name</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Expiry Date</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.id}</td>
              <td>{medicine.name}</td>
              <td>{medicine.category}</td>
              <td>{medicine.manufacturer}</td>
              <td>{medicine.expiry_date}</td>
              <td>{medicine.price}</td>
              <td>{medicine.stock_quantity}</td>
              <td>
                <EyeOutline
                  className="me-1"
                  color={"#0096ff"}
                  onClick={() => handleShow("update", medicine)}
                  style={{ cursor: "pointer" }}
                />
                <TrashOutline
                  className="ms-2"
                  color={"#ff0000"}
                  onClick={() => handleShow("delete", medicine)}
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
          {modalType === "add" && (
            <CreateNewMedicine show={modalType === "add"} />
          )}

          {modalType === "update" && (
            <UpdateMedicine
              show={modalType === "update"}
              medicine={selectedMedicine}
            />
          )}

          {modalType === "delete" && (
            <DeleteMedicine
              show={modalType === "delete"}
              medicine={selectedMedicine}
            />
          )}
        </CenterModal>
      )}
    </div>
  );
};

export default Medicines;
