import axiosInstance from "@/api/axiosInstance";

export async function createPaymentService(formData) {
    const { data } = await axiosInstance.post(`/student/order/create`, formData);
    return data;
}

export async function captureAndFinalizePaymentService( paymentId, payerId, orderId) {
    const { data } = await axiosInstance.post(`/student/order/capture`, { paymentId, payerId, orderId});
    return data;
}
