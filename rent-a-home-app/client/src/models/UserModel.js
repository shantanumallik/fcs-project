import axios from 'axios';

const config = {
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
};

export const loginUser = async (username, password) => {
    const API_URL = `${process.env.REACT_APP_API_DOMAIN}/api/users/login`;
    try {
        const body = { username, password };
        const response = await axios.post(API_URL, body, config);
        return response.data;
    } catch (error) {
        throw new Error('Login failed.');
    }
};
