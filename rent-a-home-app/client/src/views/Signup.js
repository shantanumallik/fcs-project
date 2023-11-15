// SignupView.js
import React, { useState } from 'react';
import {
    TextField, Button, Typography, FormControl, InputLabel, 
    Select, MenuItem, Paper, Box
} from '@mui/material';
import SignupController from '../controllers/SignupController';

const SignupView = () => {
    // States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [qrCodeData, setQrCodeData] = useState('');

    const [eKYCEmail, setEKYCEmail] = useState('');
    const [eKYCPassword, setEKYCPassword] = useState('');

    // Handler to sign up the user
    const handleSignupClick = async () => {
        const data = {
            username, password, userType, email, phone, address,
            eKYCEmail, eKYCPassword // Include eKYC fields in the data object
        };
        const responseMessage = await SignupController.handleSignup(data);
        setMessage(responseMessage);
    };

    // Handler to read the QR code from the uploaded image
    const handleImageUpload = (event) => {
        SignupController.handleImageUpload(event, setQrCodeData, setMessage);
    };

    // Presentation layer
    return (
        <Paper elevation={5} className="signup-paper">
            <Typography variant="h4" gutterBottom>
                Signup
            </Typography>
            <TextField className="signup-field" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField className="signup-field" label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            <FormControl variant="outlined" className="signup-field">
                <InputLabel>User Type</InputLabel>
                <Select value={userType} onChange={(e) => setUserType(e.target.value)} label="User Type">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="seller_renter">Seller/Renter</MenuItem>
                    <MenuItem value="buyer_rentee">Buyer/Rentee</MenuItem>
                </Select>
            </FormControl>
            <TextField className="signup-field" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField className="signup-field" label="Phone Number" variant="outlined" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField className="signup-field" label="Address" variant="outlined" value={address} onChange={(e) => setAddress(e.target.value)} />
            {/* eKYC verification fields */}
            <Typography variant="h5" gutterBottom>
                eKYC Verification
            </Typography>
            <TextField className="signup-field" label="eKYC Email" variant="outlined" value={eKYCEmail} onChange={(e) => setEKYCEmail(e.target.value)} />
            <TextField className="signup-field" label="eKYC Password" type="password" variant="outlined" value={eKYCPassword} onChange={(e) => setEKYCPassword(e.target.value)} />

            {/* File upload and signup button */}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <Button className="signup-button" variant="contained" color="primary" onClick={handleSignupClick}>
                Signup
            </Button>

            {/* Message display */}
            <Box className="signup-message">
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    {message}
                </Typography>
                {qrCodeData && (
                    <Typography variant="body1" color="textPrimary">
                        QR Code Data: {qrCodeData}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}

export default SignupView;
