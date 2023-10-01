// components/Properties.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/properties');
                setProperties(response.data);
            } catch (err) {
                setError('Failed to fetch properties. ' + err.message);
            }
        };

        fetchProperties();
    }, []);

    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Available Properties
            </Typography>
            {error && <Typography variant="body1" color="error">{error}</Typography>}
            <Grid container spacing={4}>
                {properties.map((property) => (
                    <Grid item xs={12} sm={6} md={4} key={property._id}>
                        <Card component={Link} to={`/properties/${property._id}`}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {property.title}
                                    </Typography>
                                    <Typography variant="body2">
                                        {property.description}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        Price: {property.price}
                                    </Typography>
                                    {property.images && property.images.length > 0 && (
                                        <img src={property.images[0]} alt={property.title} style={{ width: '100%', marginTop: '10px' }} />
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Properties;
