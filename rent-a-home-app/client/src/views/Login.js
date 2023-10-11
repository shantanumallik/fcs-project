import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import { handleLogin } from '../controllers/LoginController';
import './css/Login.css';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    }, [redirectTo, navigate]);

    return (
        <Container className="login-container">
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField className="login-field" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField className="login-field" label="Password" type="password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="login-button" variant="contained" color="primary" onClick={() => handleLogin(username, password, setUser, setMessage, setRedirectTo)}>
                Login
            </Button>
            <Typography variant="body1" color="textSecondary" className="login-message">
                {message}
            </Typography>
        </Container>
    );
}

export default Login;
