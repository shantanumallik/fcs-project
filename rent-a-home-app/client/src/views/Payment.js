import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Typography } from '@mui/material';

const Payment = ({ onPaymentSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        // Fetch order ID from your backend
        axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/payment/create-payment-order`, { amount: 1000 }) // Example amount
            .then(response => setOrderId(response.data.orderId))
            .catch(error => setError('Error fetching order ID: ' + error.message));

        // Cleanup the script when the component unmounts
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        const options = {
            key: process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: 1000 * 100, // Amount is in currency subunits. Default currency is INR. Hence, 1000*100
            currency: 'INR',
            name: 'Your Business Name',
            description: 'Test Transaction',
            order_id: orderId,
            handler: function (response) {
                setLoading(false);
                onPaymentSuccess();
            },
            prefill: {
                name: 'Your Name',
                email: 'email@example.com',
                contact: '9999999999'
            },
            notes: {
                address: 'Razorpay Corporate Office'
            },
            theme: {
                color: '#3399cc'
            }
        };

        if(window.Razorpay) {
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } else {
            setError('Failed to load payment service');
            setLoading(false);
        }
    };

    return (
        <div>
            <Button onClick={handlePayment} disabled={loading} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                {loading ? <CircularProgress size={24} /> : 'Pay with Razorpay'}
            </Button>
            {error && <Typography color="error">{error}</Typography>}
        </div>
    );
};

export default Payment;
