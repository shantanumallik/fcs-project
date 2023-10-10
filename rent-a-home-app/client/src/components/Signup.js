import React, { useState } from 'react';
import axios from 'axios';
import {
    TextField, Button, Container, Typography, FormControl,
    InputLabel, Select, MenuItem, Paper, Box
} from '@mui/material';
import './css/Signup.css';   

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    };

    const handleSignup = async () => {
        try {
            const body = {
                username,
                password,
                userType,
                email,
                phone,
                address
            };
            await axios.post(  'https://192.168.2.244/api/users/signup', body, config);
            setMessage('Signup successful!');
        } catch (error) {
            setMessage('Signup failed.');
        }
    };

    return (
        <Container className="signup-background" display="flex">
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
                <Button className="signup-button" variant="contained" color="primary" onClick={handleSignup}>
                    Signup
                </Button>
                <Box className="signup-message">
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        {message}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default Signup;
