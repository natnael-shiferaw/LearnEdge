import axiosInstance from "@/api/axiosInstance";

export async function fetchInstructorCourseListService() {
    const {data} = await axiosInstance.get(`/instructor/course/get`);
    return data;
}

export async function fetchInstructorCourseDetailsService(id) {
    const {data} = await axiosInstance.get(`/instructor/course/get/details/${id}`);
    return data;
}

export async function addNewCourseService(formData) {
    const {data} = await axiosInstance.post(`/instructor/course/add`, formData);
    return data;
}

export async function updateCourseByIdService(id, formData) {
    const {data} = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
    return data;
}
