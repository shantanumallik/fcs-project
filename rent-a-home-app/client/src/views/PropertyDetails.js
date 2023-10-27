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
        </Container>
    );
}

export default PropertyDetails;
