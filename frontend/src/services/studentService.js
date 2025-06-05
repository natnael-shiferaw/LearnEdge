import axiosInstance from "@/api/axiosInstance";

export async function fetchStudentViewCourseListService() {
    const { data } = await axiosInstance.get(`/student/course/get`);
    return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
    const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);
    return data;
}
