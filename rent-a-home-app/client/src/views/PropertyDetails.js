import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import './css/PropertyDetails.css';

const PropertyDetails = () => {
    const { propertyId } = useParams();
    const [property, setProperty] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/properties/${propertyId}`);
                setProperty(response.data);
            } catch (err) {
                setError('Failed to fetch property. ' + err.message);
            }
        };

        fetchProperty();
    }, [propertyId]);

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
                        <Typography variant="body1">
                            {property.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="textSecondary">
                            Price: ${property.price}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {property.images && property.images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={property.title} 
                                className="property-image"
                            />
                        ))}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default PropertyDetails;
