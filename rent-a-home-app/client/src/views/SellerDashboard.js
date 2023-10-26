import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, Grid, Paper, Button, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField, CircularProgress, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './css/SellerDashboard.css';

const SellerDashboard = ({ user }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [propertyToEdit, setPropertyToEdit] = useState({});
    const [propertyToDelete, setPropertyToDelete] = useState(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/properties/seller/${user.user._id}`);
                setProperties(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching properties", error);
                setLoading(false);
            }
        }

        fetchProperties();
    }, [user.user._id]);

    // Edit property handlers
    const handleEditProperty = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_API_DOMAIN}/api/properties/${propertyToEdit._id}`, {
                ...propertyToEdit,
                sellerId: user.user._id // add the sellerId
            });
            setProperties(prevProperties => prevProperties.map(p => p._id === propertyToEdit._id ? propertyToEdit : p));
            closeEditDialog();
        } catch (error) {
            console.error("Error editing property", error);
        }
    };

    const openEditDialog = (property) => {
        setPropertyToEdit({ ...property });
        setEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        setPropertyToEdit({});
        setEditDialogOpen(false);
    };

    // Delete property handlers
    const handleDeleteProperty = async (propertyId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_DOMAIN}/api/properties/delete/${propertyId}?sellerId=${user.user._id}`); // add the sellerId as a query parameter
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
                            <Box display="flex" justifyContent="flex-end">
                                <IconButton onClick={() => openEditDialog(property)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => openDeleteDialog(property._id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={editDialogOpen} onClose={closeEditDialog}>
                <DialogTitle>Edit Property</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        value={propertyToEdit.title}
                        onChange={(e) => setPropertyToEdit({ ...propertyToEdit, title: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Price"
                        value={propertyToEdit.price}
                        onChange={(e) => setPropertyToEdit({ ...propertyToEdit, price: e.target.value })}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Description"
                        value={propertyToEdit.description}
                        onChange={(e) => setPropertyToEdit({ ...propertyToEdit, description: e.target.value })}
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeEditDialog} color="primary">Cancel</Button>
                    <Button onClick={handleEditProperty} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
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
        </Container>
    );
}

export default SellerDashboard;
