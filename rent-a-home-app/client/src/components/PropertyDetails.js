// components/PropertyDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

const PropertyDetails = () => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/properties/${propertyId}`);
                setProperty(response.data);
            } catch (err) {
                setError('Failed to fetch property. ' + err.message);
            }
        };

        fetchProperty();
    }, [propertyId]);

    if (!property) return <Typography>Loading...</Typography>;

    return (
        <Container component={Paper} elevation={3} sx={{ padding: 4, marginTop: 5 }}>
            <Typography variant="h4" gutterBottom>
                {property.title}
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="body1">
                        {property.description}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">
                        Price: {property.price}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {property.images && property.images.map((image, index) => (
                        <img key={index} src={image} alt={property.title} style={{ width: '100%', marginTop: '10px' }} />
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
}

export default PropertyDetails;
