import axiosInstance from "@/api/axiosInstance";

// a service to register users
export const registerService = async(formData) => {
    const { data } = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user'
    });

    return data
}
