import api from './api';

export const paymentService = {
    createOrder: async (orderData) => {
        const { data } = await api.post('payment/create-order', orderData);
        return data;
    },
    verifyPayment: async (paymentDetails) => {
        const { data } = await api.post('payment/verify', paymentDetails);
        return data;
    }
};
