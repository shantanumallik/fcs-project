import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container, Typography, Grid, Paper, Button, Dialog,
    DialogActions, DialogContent, DialogContentText, DialogTitle,
    TextField, CircularProgress, Box, IconButton, Tab, Tabs, AppBar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0); // 0 for users, 1 for properties
    const [userToEdit, setUserToEdit] = useState({});
    const [propertyToEdit, setPropertyToEdit] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [entityToDelete, setEntityToDelete] = useState(null); // holds either userId or propertyId
    const [entityTypeToDelete, setEntityTypeToDelete] = useState(""); // either 'user' or 'property'

    useEffect(() => {
        async function fetchData() {
            try {
                const usersData = await axios.get('/api/admin/users/user');
                const propertiesData = await axios.get('/api/admin/properties');
                setUsers(usersData.data);
                setProperties(propertiesData.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleEditUser = async (user) => {
        setUserToEdit(user);
        await axios.put(`/api/admin/users/${user._id}`, user);
    }

    const handleEditProperty = async (property) => {
        setPropertyToEdit(property);
        await axios.put(`/api/admin/properties/${property._id}`, property);
    }

    const handleDelete = async () => {
        try {
            if (entityTypeToDelete === 'user') {
                await axios.delete(`/api/admin/users/${entityToDelete}`);
                setUsers(prevUsers => prevUsers.filter(u => u._id !== entityToDelete));
            } else if (entityTypeToDelete === 'property') {
                await axios.delete(`/api/admin/properties/${entityToDelete}`);
                setProperties(prevProps => prevProps.filter(p => p._id !== entityToDelete));
            }
            closeDeleteDialog();
        } catch (error) {
            console.error("Error deleting entity", error);
        }
    }

    const openDeleteDialog = (id, entityType) => {
        setEntityToDelete(id);
        setEntityTypeToDelete(entityType);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setEntityToDelete(null);
        setEntityTypeToDelete("");
        setDeleteDialogOpen(false);
    };

    if (loading) return <CircularProgress />;

    return (
        <Container>
            <AppBar position="static">
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label="Users" />
                    <Tab label="Properties" />
                </Tabs>
            </AppBar>

            {activeTab === 0 && (
                <Grid container spacing={3}>
                    {users.map(user => (
                        <Grid item xs={12} sm={6} md={4} key={user._id}>
                            <Paper elevation={3}>
                                <Typography variant="h6">{user.email}</Typography>
                                <Box display="flex" justifyContent="flex-end">
                                    <IconButton onClick={() => handleEditUser(user)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => openDeleteDialog(user._id, 'user')} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            {activeTab === 1 && (
                <Grid container spacing={3}>
                    {properties.map(property => (
                        <Grid item xs={12} sm={6} md={4} key={property._id}>
                            <Paper elevation={3}>
                                <Typography variant="h6">{property.title}</Typography>
                                <Box display="flex" justifyContent="flex-end">
                                    <IconButton onClick={() => handleEditProperty(property)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => openDeleteDialog(property._id, 'property')} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this {entityTypeToDelete}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">Cancel</Button>
                    <Button onClick={handleDelete} color="secondary">Delete</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default AdminDashboard;
