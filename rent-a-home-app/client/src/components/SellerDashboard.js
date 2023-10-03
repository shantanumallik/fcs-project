import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './css/SellerDashboard.css';    

const SellerDashboard = ({ user }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const response = await axios.get(`http://localhost:3001/api/properties/seller/${user.user._id}`);
                setProperties(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching properties", error);
                setLoading(false);
            }
        }

        fetchProperties();
    }, [user.user._id]);

    const handleDeleteProperty = async (propertyId) => {
        try {
            await axios.delete(`http://localhost:3001/api/properties/${propertyId}`, {
                params: {
                    sellerId: user.user._id
                }
            });
            setProperties(prevProperties => prevProperties.filter(p => p._id !== propertyId));
            closeDeleteDialog();
        } catch (error) {
            console.error("Error deleting property", error);
        }
    };

    const openDeleteDialog = (propertyId) => {
        setPropertyToDelete(propertyId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setPropertyToDelete(null);
        setDeleteDialogOpen(false);
    };

    if (loading) return <CircularProgress />;

    return (
        <Container className="seller-dashboard-container">
            <Box className="seller-dashboard-box">
                <Typography variant="h4" gutterBottom align="center">
                    Your Properties
                </Typography>

                <Grid container spacing={3}>
                    {properties.map(property => (
                        <Grid item xs={12} sm={6} md={4} key={property._id}>
                            <Paper elevation={3} className="property-paper">
                                <Typography variant="h6">{property.title}</Typography>
                                <Typography variant="subtitle1">{property.price}</Typography>
                                <Typography variant="body2" className="description-text">{property.description}</Typography>
                                <Button 
                                    component={Link} 
                                    to={`/modify-property/${property._id}`} 
                                    className="modify-button"
                                >
                                    Modify
                                </Button>
                                <Button 
                                    onClick={() => openDeleteDialog(property._id)} 
                                    color="secondary" 
                                    className="delete-button"
                                >
                                    Delete
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog
                    open={deleteDialogOpen}
                    onClose={closeDeleteDialog}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete this property?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
                        <Button onClick={() => handleDeleteProperty(propertyToDelete)} color="secondary">Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default SellerDashboard;
