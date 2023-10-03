import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography, Grid, Card, CardContent,
    CardActionArea, CardMedia, Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import './css/Properties.css';

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
        <Box className="properties-background">
            <Box className="properties-content-container">
                <Typography variant="h4" gutterBottom>
                    Available Properties
                </Typography>
                {error && <Typography variant="body1" color="error">{error}</Typography>}
                <Grid container spacing={4}>
                    {properties.map((property) => (
                        <Grid item xs={12} sm={6} md={4} key={property._id}>
                            <Card 
                                component={Link} 
                                to={`/properties/${property._id}`} 
                                className="properties-card"
                            >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={property.images && property.images.length > 0 ? property.images[0] : ""}
                                        alt={property.title}
                                        className="properties-image"
                                    />
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {property.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {property.description}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Price: INR {property.price}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Properties;
