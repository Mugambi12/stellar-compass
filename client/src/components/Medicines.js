import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "react-bootstrap";
import { EyeOutline, TrashOutline, AddOutline } from "react-ionicons";
import MedicationModal from "../utils/MedicationModal";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showNewMedicationModal, setShowNewMedicationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetch("/medicines/medications")
      .then((response) => response.json())
      .then((data) => setMedicines(data));
  }, []);

  const handleViewMedication = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleNewMedication = () => setShowNewMedicationModal(true);
  const handleCloseNewMedicationModal = () => setShowNewMedicationModal(false);

  const handleDeleteMedication = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <div className="container">
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
            onClick={handleNewMedication}
            style={{ cursor: "pointer", fontSize: "24px" }}
          />
        </Col>
      </Row>

      <Table responsive borderless hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th>Dosage</th>
            <th>Manufacturer</th>
            <th>Expiry Date</th>
            <th>Category</th>
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
              <td>{medicine.description}</td>
              <td>{medicine.dosage}</td>
              <td>{medicine.manufacturer}</td>
              <td>{medicine.expiry_date}</td>
              <td>{medicine.category}</td>
              <td>{medicine.price}</td>
              <td>{medicine.stock_quantity}</td>
              <td>
                <EyeOutline
                  className="me-1"
                  color={"#0096ff"}
                  onClick={handleViewMedication}
                  style={{ cursor: "pointer" }}
                />
                <TrashOutline
                  color={"#ff0000"}
                  onClick={handleDeleteMedication}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Render Update Medication Modal */}
      <MedicationModal
        show={showUpdateModal}
        handleClose={handleCloseUpdateModal}
        title="View Medication"
        body="I will not close if you click outside me. Do not even try to press the escape key."
        actionButtonLabel="Close"
        onActionButtonClick={handleCloseUpdateModal}
        size="lg"
      />

      {/* Render New Medication Modal */}
      <MedicationModal
        show={showNewMedicationModal}
        handleClose={handleCloseNewMedicationModal}
        title="Add New Medication"
        body="Add form fields for adding new medication here. I will not close if you click outside me. Do not even try to press the escape key."
        actionButtonLabel="Save"
        onActionButtonClick={() => {
          // Logic to save the new medication
          handleCloseNewMedicationModal();
        }}
        size="lg"
      />

      {/* Render Delete Medication Modal */}
      <MedicationModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        title="Delete Medication"
        body="Add content for deleting medication here. I will not close if you click outside me. Do not even try to press the escape key."
        actionButtonLabel="Close"
        onActionButtonClick={handleCloseDeleteModal}
        size="sm"
      />
    </div>
  );
};

export default Medicines;
