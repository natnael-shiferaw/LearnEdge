import axiosInstance from "@/api/axiosInstance";

// a service to register users
export const registerService = async(formData) => {
    const { data } = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user'
    });
    return data
}
// a service to login a user
export const loginService = async(formData) => {
    const { data } = await axiosInstance.post('/auth/login', formData);
    return data
}

export const checkAuthService = async() => {
    const { data } = await axiosInstance.get('/auth/check-auth');
    return data
}
