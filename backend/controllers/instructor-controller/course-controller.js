const Course = require('../../models/Course')

const addNewCourse = async (req, res) => {
    try {
        const courseData = req.body;
        const newlyCreatedCourse = new Course(courseData);
        const savedCourse = await newlyCreatedCourse.save();
        if (savedCourse) {
            res.status(201).json({
                success: true,
                message: "Course added successfully!",
                data: savedCourse
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while adding a new course!" });
    }
}

const getAllCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({});
        if (coursesList) {
            res.status(200).json({
                success: true,
                message: "Courses fetched successfully!",
                data: coursesList
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while getting all courses!" });
    }
}

const getCourseDetailsByID = async (req, res) => {
    try {
        const { id } = req.params;
        const courseDetail = await Course.findById(id);
        if (!courseDetail) {
            res.status(404).json({ success: false, message: "Course not found!" })
        }
        res.status(200).json({
            success: true,
            message: "Course detail fetched successfully!",
            data: courseDetail
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while getting course detail!" });
    }
}

const updateCourseByID = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCourseData = req.body;
        const updatedCourse = await Course.findByIdAndUpdate(id, updatedCourseData, { new: true });

        if (!updatedCourse) {
            res.status(404).json({ success: false, message: "Course not found!" })
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            data: updatedCourse
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error occured while updating course!" });
    }
}

const deleteCourseByID = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Course.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Course not found!" })
        }
        return res.status(200).json({
            success: true,
            message: "Course deleted successfully!",
            data: deleted
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting course!"
        })
    }
}

module.exports = { addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID, deleteCourseByID }
