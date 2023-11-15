// SignupController.js
import axios from 'axios';
import QRCode from 'qrcode-reader';
import SignupModel from '../models/SignupModel';

const SignupController = {
    handleSignup: async (data) => {
        // First, verify with the KYC endpoint
        const signupData = {
            ...data,
            eKYCEmail: data.eKYCEmail,
            eKYCPassword: data.eKYCPassword
        };
        return await SignupModel.signupUser(data);
    },

    handleImageUpload: (event, setQrCodeData, setMessage) => {
        const reader = new QRCode();
        const file = event.target.files[0];
        const readerObj = new FileReader();
        readerObj.readAsDataURL(file);
        readerObj.onload = function (event) {
            reader.decode(event.target.result);
        };
        reader.callback = function (error, result) {
            if (error) {
                console.error(error);
                setMessage('Error reading QR Code.');
            } else {
                setQrCodeData(result.data);
            }
        };
    }
};

const verifyKYC = async (email, password) => {
    try {
        const response = await axios.post('https://192.168.3.39:5000/kyc', { email, password });
        return response.data.status === 'success' && response.data.message === 'Login successful';
    } catch (error) {
        console.error('Error in KYC verification:', error);
        return false;
    }
};

export default SignupController;
