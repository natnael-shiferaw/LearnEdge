import axiosInstance from "@/api/axiosInstance";

export async function fetchStudentViewCourseListService() {
    const { data } = await axiosInstance.get(`/student/course/get`);
    return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
    const { data } = await axiosInstance.get(`/student/course/get/details/${courseId}`);
    return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
    const { data } = await axiosInstance.get(
        `/student/course/purchase-info/${courseId}/${studentId}`
    );

    return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
    const { data } = await axiosInstance.get(
        `/student/courses-bought/get/${studentId}`
    );

    return data;
}
