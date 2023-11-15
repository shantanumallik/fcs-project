import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, CircularProgress, Button, TextareaAutosize, Dialog } from '@mui/material';
import { useParams } from 'react-router-dom';
import Payment from './Payment';
import './css/PropertyDetails.css';

const PropertyDetails = ({ user }) => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');
    const [isBuying, setIsBuying] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [contractText, setContractText] = useState('');
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);




    const generateContract = async () => {
        try {
            // Replace with your actual contract details
            const contractDetails = {
                propertyId: propertyId,
                sellerId: property.sellerId || 'unavailable',
                buyerId: user.user._id,
                rentalTerms: 'Rental term details here...'
            };

            const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/properties/generate-contract`, contractDetails);
            setContractText(response.data.contractText);
        } catch (error) {
            console.error('Error generating contract:', error);
            // Handle error
        }
    };


    const submitFinalContract = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_DOMAIN}/api/properties/submit-final-contract`, {
                propertyId,
                sellerId: property.sellerId || 'unavailable',
                buyerId: user.user._id,
                tenant: property.tenant || 'unavailable',
                finalContractText: contractText
            });
            console.log(response.data); // Handle the response
            // Further actions after successful submission, e.g., notification to the user
        } catch (error) {
            console.error('Error submitting final contract:', error);
            // Handle error
        }
    };


    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/properties/${propertyId}`);
                setProperty(response.data);
                console.log(JSON.stringify(response.data));
            } catch (err) {
                setError('Failed to fetch property. ' + err.message);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (error) return <Typography color="error">{error}</Typography>;
    if (!property) return <CircularProgress />;

    const onBuyRentProperty = () => {
        setIsBuying(true);
        setOpenPaymentDialog(false); // Open the payment dialog
        onPaymentSuccess();
    };


    const onPaymentSuccess = () => {
        setPaymentCompleted(true);
        generateContract();
        setOpenPaymentDialog(false); // Close the payment dialog
    };

    const handleContractChange = (event) => {
        setContractText(event.target.value);
    };


    if (error) return <Typography color="error">{error}</Typography>;
    if (!property) return <CircularProgress />;

    return (
        <Container className="property-details-background">
            <Box 
                component={Paper}
                elevation={5}
                className="property-details-content"
            >
                <Typography variant="h4" gutterBottom align="center">
                    {property.title}
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {property.imageUrl && 
                            <img 
                                src={property.imageUrl} 
                                alt={property.title} 
                                className="property-image"
                            />
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {property.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Owner: {property.owner || 'Not Available'}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Price: INR {property.price}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Location: {property.location}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Amenities: 
                            {property.amenities && Object.entries(property.amenities).map(([key, value], index) => 
                                value ? <span key={index}> {key.charAt(0).toUpperCase() + key.slice(1)},</span> : null
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Available from: {new Date(property.availabilityDate).toDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>

            {!isBuying && (
                <Button variant="contained" color="primary" onClick={onBuyRentProperty}>
                    Buy/Rent Property
                </Button>
            )}

            {isBuying && !paymentCompleted && (
                <Dialog
                open={openPaymentDialog}
                onClose={() => setOpenPaymentDialog(false)}
                aria-labelledby="payment-dialog-title"
            >
                    <Payment onPaymentSuccess={onPaymentSuccess} />
                </Dialog>
            )}

            {paymentCompleted && (
                <>
                    <TextareaAutosize
                        aria-label="Contract Text"
                        minRows={10}
                        value={contractText}
                        onChange={handleContractChange}
                        style={{ width: '100%', marginTop: '20px' }}
                    />
                    <Button variant="contained" color="secondary" onClick={submitFinalContract} style={{ marginTop: '20px' }}>
                        Submit Final Contract
                    </Button>
                </>
            )}
        </Container>
    );
}

export default PropertyDetails;
