import React from "react";
import { Modal, Button } from "react-bootstrap";

const MedicationModal = ({
  show,
  handleClose,
  title,
  body,
  actionButtonLabel,
  onActionButtonClick,
  size = "md", // Default size is medium
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size={size}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button size="sm" variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button size="sm" variant="primary" onClick={onActionButtonClick}>
          {actionButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicationModal;
