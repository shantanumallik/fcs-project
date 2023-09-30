import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
            await axios.post('http://localhost:3001/api/users/signup', body, config);
            setMessage('Signup successful!');
        } catch (error) {
            setMessage('Signup failed.');
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Signup
            </Typography>
            <TextField
                sx={{ my: 1, width: '300px' }}
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                sx={{ my: 1, width: '300px' }}
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <FormControl variant="outlined" sx={{ my: 1, width: '300px' }}>
                <InputLabel>User Type</InputLabel>
                <Select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    label="User Type"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="seller_renter">Seller/Renter</MenuItem>
                    <MenuItem value="buyer_rentee">Buyer/Rentee</MenuItem>
                </Select>
            </FormControl>
            <TextField
                sx={{ my: 1, width: '300px' }}
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                sx={{ my: 1, width: '300px' }}
                label="Phone Number"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
                sx={{ my: 1, width: '300px' }}
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <Button
                sx={{ my: 1 }}
                variant="contained"
                color="primary"
                onClick={handleSignup}
            >
                Signup
            </Button>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                {message}
            </Typography>
        </Container>
    );
}

export default Signup;
