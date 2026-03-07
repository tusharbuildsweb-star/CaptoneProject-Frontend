import api from './api';

export const packageService = {
    create: async (packageData) => {
        const { data } = await api.post('packages', packageData);
        return data;
    },
    getByRestaurant: async (restaurantId) => {
        const { data } = await api.get(`packages/${restaurantId}`);
        return data;
    },
    update: async (id, packageData) => {
        const { data } = await api.put(`packages/${id}`, packageData);
        return data;
    },
    delete: async (id) => {
        const { data } = await api.delete(`packages/${id}`);
        return data;
    }
};
