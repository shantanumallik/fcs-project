// SignupModel.js
import axios from 'axios';

const config = {
    headers: {
        "Access-Control-Allow-Origin": "*"
    }
};

const SignupModel = {
    signupUser: async (data) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/users/signup`, data, config);
            return 'Signup successful!';
        } catch (error) {
            console.log(error)
            return 'Signup failed.';
        }
    }
};

export default SignupModel;
