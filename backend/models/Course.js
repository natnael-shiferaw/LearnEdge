const mongoose = require("mongoose")
const { Schema } = mongoose

// Lecture sub‐schema
const LectureSchema = new Schema({
  id: { type: Number, required: true },            // your front-end timestamp id
  title: { type: String, required: true },
  videoUrl: { type: String, default: null },
  duration: { type: String, default: "0:00" },
  isPreview: { type: Boolean, default: false },
  publicId: { type: String, default: null }        // Cloudinary public_id
})

// Section sub‐schema
const SectionSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  expanded: { type: Boolean, default: true },
  lectures: { type: [LectureSchema], default: [] }
})

const CourseSchema = new Schema({
  instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  instructorName: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },

  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },          // beginner / intermediate / etc.
  language: { type: String, default: "English" },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  welcomeMessage: { type: String, required: true },

  image: {
    url: { type: String, required: true },          // cloudinary secure_url
    publicId: { type: String, required: true }      // cloudinary public_id
  },

  price: { type: Number, required: true },
  learningObjectives: { type: [String], default: [], required: true },
  curriculum: { type: [SectionSchema], default: [] },

  students: [
    {
      studentId: { type: Schema.Types.ObjectId, ref: "User" },
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],

  isPublished: Boolean,
})

module.exports = mongoose.model("Course", CourseSchema)
