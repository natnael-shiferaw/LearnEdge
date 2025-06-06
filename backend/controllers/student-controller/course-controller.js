const Course = require('../../models/Course')
const StudentCourses = require("../../models/StudentCourses");

const getAllStudentViewCourses = async (req, res) => {
    try {
        const coursesList = await Course.find({});
        if(coursesList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No course found!',
                data: []
            })
        }

        res.status(200).json({
            success: true,
            message: 'All courses fetched successfully!',
            data: coursesList
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occured while fetching student courses!'
        })
    }
}

const getStudentViewCourseDetails = async (req, res) => {
    try {
        const {id} = req.params;
        const courseDetails = await Course.findById(id);
        if(!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'No course details found!',
                data: null
            })
        }

        res.status(200).json({
            success: true,
            message: 'Course details fetched successfully!',
            data: courseDetails
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error occured while fetching student course details!'
        })
    }
}

const checkCoursePurchaseInfo = async (req, res) => {
    try {
      const { id, studentId } = req.params;
      const studentCourses = await StudentCourses.findOne({
        userId: studentId,
      });
  
      const ifStudentAlreadyBoughtCurrentCourse =
        studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
      res.status(200).json({
        success: true,
        data: ifStudentAlreadyBoughtCurrentCourse,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };

module.exports = {getAllStudentViewCourses, getStudentViewCourseDetails, checkCoursePurchaseInfo}
