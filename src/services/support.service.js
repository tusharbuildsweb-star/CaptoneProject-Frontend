import api from './api';

export const supportService = {
    createTicket: async (ticketData) => {
        const { data } = await api.post('support', ticketData);
        return data; // assumes backend directly returns data or we want data
    },
    getUserTickets: async () => {
        // the backend supportController usually wraps in `res.json(data)`
        const { data } = await api.get('support/user');
        return data;
    }
};
