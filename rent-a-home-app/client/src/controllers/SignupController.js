// SignupController.js
import QRCode from 'qrcode-reader';
import SignupModel from '../models/SignupModel';

const SignupController = {
    handleSignup: async (data) => {
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
                //console.log('qr: ' + JSON.stringify(result.result));
                setQrCodeData(result.data);
            }
        };
    }
};

export default SignupController;
