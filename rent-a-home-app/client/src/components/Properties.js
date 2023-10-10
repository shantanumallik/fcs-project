import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Typography, Grid, Card, CardContent,
    CardActionArea, CardMedia, Box, TextField, Button, Pagination
} from '@mui/material';
import { Link } from 'react-router-dom';
import './css/Properties.css';

const Properties = () => {
    const [allProperties, setAllProperties] = useState([]);
    const [displayedProperties, setDisplayedProperties] = useState([]);
    const [error, setError] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterBudget, setFilterBudget] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('https://192.168.2.244/api/properties');
                setAllProperties(response.data);
            } catch (err) {
                setError('Failed to fetch properties. ' + err.message);
            }
        };

        fetchProperties();
    }, []);

    useEffect(() => {
        const filtered = allProperties.filter(property => 
            (!filterName || property.title.toLowerCase().includes(filterName.toLowerCase())) &&
            (!filterBudget || property.price <= parseFloat(filterBudget))
        );

        const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        setDisplayedProperties(paginated);
    }, [allProperties, filterName, filterBudget, currentPage]);

    return (
        <Box className="properties-background">
            <Box className="properties-content-container">
                <Typography variant="h4" gutterBottom align="center">
                    Available Properties
                </Typography>

                <Box className="properties-filter-container" display="flex" justifyContent="center">
                    <Box display="flex" gap="10px" alignItems="center">
                        <TextField 
                            label="Name" 
                            value={filterName}
                            onChange={e => setFilterName(e.target.value)}
                            variant="outlined" 
                        />
                        <TextField 
                            label="Budget" 
                            value={filterBudget}
                            onChange={e => setFilterBudget(e.target.value)}
                            variant="outlined" 
                        />
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => { setFilterName(''); setFilterBudget(''); setCurrentPage(1); }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                </Box>

                {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}

                <Grid container spacing={4}>
                    {displayedProperties.map((property) => (
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

                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination 
                        count={Math.ceil(allProperties.length / itemsPerPage)} 
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        className="properties-pagination"
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default Properties;
