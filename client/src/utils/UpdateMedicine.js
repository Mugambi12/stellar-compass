// UpdateMedicine.js
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";

const UpdateMedicine = ({ show, medicine }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (medicine) {
      setValue("name", medicine.name);
      setValue("manufacturer", medicine.manufacturer);
      setValue("category", medicine.category);
      setValue("price", medicine.price);
      setValue("stock_quantity", medicine.stock_quantity);
      setValue("expiry_date", medicine.expiry_date);
      setValue("dosage", medicine.dosage);
      setValue("description", medicine.description);
    }
    setIsLoading(false);
  }, [medicine, setValue]);

  const updateForm = async (data) => {
    setIsSubmitting(true);
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(
        `/medicines/medications/${medicine.id}`,
        requestOptions
      );
      const responseData = await response.json();

      if (response.ok) {
        reset();
        window.location.reload();
      } else {
        setServerResponse("Error updating medicine. Please try again later.");
        console.error("Error updating medicine: " + responseData.message);
      }
    } catch (error) {
      setServerResponse("Error updating medicine. Please try again later.");
      console.error("Error updating medicine:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div style={{ display: show ? "block" : "none" }}>
      {serverResponse && (
        <Alert
          variant={
            serverResponse.includes("successfully") ? "success" : "danger"
          }
        >
          {serverResponse}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(updateForm)}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <p className="text-danger small">Name is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Manufacturer</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Manufacturer"
                {...register("manufacturer", { required: true })}
              />
              {errors.manufacturer && (
                <p className="text-danger small">Manufacturer is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Category"
                {...register("category", { required: true })}
              />
              {errors.category && (
                <p className="text-danger small">Category is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Price"
                {...register("price", { required: true })}
              />
              {errors.price && (
                <p className="text-danger small">Price is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Stock Quantity"
                {...register("stock_quantity", { required: true })}
              />
              {errors.stock_quantity && (
                <p className="text-danger small">Stock Quantity is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter Expiry Date"
                {...register("expiry_date", { required: true })}
              />
              {errors.expiry_date && (
                <p className="text-danger small">Expiry Date is required</p>
              )}
            </Form.Group>
          </Col>

          <Col md={6} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Dosage"
                {...register("dosage")}
              />
            </Form.Group>
          </Col>

          <Col md={12} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter Description"
                {...register("description", { required: true })}
              />
              {errors.description && (
                <p className="text-danger small">Description is required</p>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </Form>
    </div>
  );
};

export default UpdateMedicine;
