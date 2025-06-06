const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseImage: {
    url: { type: String, required: true },          // cloudinary secure_url
    publicId: { type: String, required: true }      // cloudinary public_id
  },
  courseTitle: String,
  courseId: String,
  coursePricing: String,
});

module.exports = mongoose.model("Order", OrderSchema);
