import axios from 'axios';

export const listProperty = async (formData) => {
    const API_URL = `${process.env.REACT_APP_API_DOMAIN}/api/properties/list`;
    try {
        await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return 'Property listed successfully!';
    } catch (error) {
        throw new Error('Listing failed: ' + error.message);
    }
};
