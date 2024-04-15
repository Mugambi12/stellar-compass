import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const DeleteOrder = ({ show, order, onDelete }) => {
  const [serverResponse, setServerResponse] = useState(null);
  const { handleSubmit } = useForm();
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

  const deleteOrder = async () => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const response = await fetch(
        `/orders/orders/${order.id}`,
        requestOptions
      );

      if (response.ok) {
        onDelete(order.id);
        setServerResponse("Order deleted successfully");
      } else {
        const responseData = await response.json();
        setServerResponse("Error deleting order: " + responseData.message);
        console.error("Error deleting order:", responseData);
      }
    } catch (error) {
      setServerResponse("Error deleting order. Please try again later.");
      console.error("Error deleting order:", error);
    }
  };

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

      <Form onSubmit={handleSubmit(deleteOrder)}>
        <p>Are you sure you want to delete order {order.id}?</p>
        {/* more details of the order to be deleted */}
        <p>Order ID: {order.id}</p>
        <p>Order Date: {order.order_date}</p>
        <p>Order Status: {order.status}</p>
        <p>Order Total: {order.total}</p>
        <p>Order Customer ID: {order.customer_id}</p>
        <p>Order Shipping Address: {order.shipping_address}</p>
        <p>Order Billing Address: {order.billing_address}</p>
        <p>Order Payment Method: {order.payment_method}</p>
        <p>Order Payment Status: {order.payment_status}</p>
        <p>Order Payment Date: {order.payment_date}</p>
        <p>Order Shipping Method: {order.shipping_method}</p>
        <p>Order Shipping Status: {order.shipping_status}</p>
        <p>Order Shipping Date: {order.shipping_date}</p>
        <p>Order Shipping Tracking Number: {order.shipping_tracking_number}</p>
        <p>Order Shipping Carrier: {order.shipping_carrier}</p>
        <p>Order Shipping Cost: {order.shipping_cost}</p>
        <p>Order Tax: {order.tax}</p>
        <p>Order Discount: {order.discount}</p>
        <p>Order Discount Code: {order.discount_code}</p>
        <p>Order Discount Amount: {order.discount_amount}</p>

        <div className="text-end">
          <Button variant="danger" type="submit">
            Delete
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default DeleteOrder;
