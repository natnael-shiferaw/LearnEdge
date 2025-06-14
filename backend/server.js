
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const authRoutes = require('./routes/auth-routes/index')
const mediaRoutes = require('./routes/instructor-routes/media-routes')
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes')
const studentViewCourseRoutes = require('./routes/student-routes/course-routes')
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));

//middleware
app.use(express.json());

//database connection
mongoose.connect(MONGODB_URI)
    .then(console.log("connected to database"))
    .catch((e) => console.log(e))

// routes configuration
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/instructor/course', instructorCourseRoutes);
app.use('/api/student/course', studentViewCourseRoutes);
app.use("/api/student/order", studentViewOrderRoutes);
app.use("/api/student/courses-bought", studentCoursesRoutes);
app.use("/api/student/course-progress", studentCourseProgressRoutes);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
