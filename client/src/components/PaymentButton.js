// PaymentButton.js
import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    const amount = 499;

    const order = await axios.post("http://localhost:5000/api/payment/create-order", {
      amount,
    });

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // replace with your actual key
      amount: order.data.amount,
      currency: "INR",
      name: "Edzest Mock Test",
      description: "Buy Mock Test",
      order_id: order.data.id,
      handler: async (response) => {
        const verify = await axios.post("http://localhost:5000/api/payment/verify", response);
        if (verify.data.success) {
          alert("Payment successful! Test Unlocked.");
          // Add logic here to unlock test access
        } else {
          alert("Payment verification failed!");
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <button onClick={handlePayment}>Buy Test for ₹499</button>
    </div>
  );
};

export default PaymentButton;
