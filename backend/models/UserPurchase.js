const mongoose = require("mongoose");

const userPurchaseSchema = new mongoose.Schema({
  userId: String,
  testId: String,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  purchaseDate: Date,
  expiryDate: Date,
});

module.exports = mongoose.model("UserPurchase", userPurchaseSchema);
