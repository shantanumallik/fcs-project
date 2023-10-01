import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    };


    const [redirectTo, setRedirectTo] = useState(null); // New state for navigation

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    }, [redirectTo, navigate]);

    const handleLogin = async () => {
        try {
            const body = { 
                username, 
                password
            };
            
            const response = await axios.post('http://localhost:3001/api/users/login', body, config);
            const userData = response.data;

            setUser(userData); // Set the complete user data
            setMessage('Login successful!');

            if (userData.user.userType === 'seller_renter') {
                setRedirectTo('/list-property');
            } else {
                setRedirectTo('/pegasus'); // Or some other default route
            }

        } catch (error) {
            setMessage('Login failed.');
        }
    };
    

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', p: 2 }}>
            <Typography variant="h4" gutterBottom>
                Login
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
            <Button
                sx={{ my: 1 }}
                variant="contained"
                color="primary"
                onClick={handleLogin}
            >
                Login
            </Button>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                {message}
            </Typography>
        </Container>
    );
}

export default Login;
