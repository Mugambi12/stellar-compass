import React from "react";
import { Modal } from "react-bootstrap";

const CenterModal = ({ show, handleClose, title, children }) => {
  const modalSize =
    title.toLowerCase().includes("delete") ||
    title.toLowerCase().includes("cancel")
      ? ""
      : "lg";
  const centerModal = !title.toLowerCase().includes("delete");

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size={modalSize}
      centered={centerModal}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="h5 fw-bold">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CenterModal;
