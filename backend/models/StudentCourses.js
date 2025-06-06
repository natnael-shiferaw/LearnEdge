const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: {
        url: { type: String, required: true },          // cloudinary secure_url
        publicId: { type: String, required: true }      // cloudinary public_id
      },
    },
  ],
});

module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);
