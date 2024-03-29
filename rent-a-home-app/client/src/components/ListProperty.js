import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Grid, Paper, Box } from '@mui/material';
import './css/ListProperty.css';    

const ListProperty = ({ user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);  
    const [message, setMessage] = useState('');

    const handleListProperty = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('sellerId', user.user._id);
        if (image) formData.append('image', image, image.name);

        try {
            await axios.post(  'https://192.168.2.244/api/properties/list', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Property listed successfully!');
        } catch (error) {
            setMessage('Listing failed: ' + error.message);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setImage(file);
    };

    return (
        <Container className="list-property-container">
            <Box 
                component={Paper}
                elevation={5}
                className="property-box"
            >
                <Typography variant="h4" gutterBottom align="center">
                    List Your Property
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Price"
                            variant="outlined"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <input
                            accept="image/*"
                            className="upload-input"
                            id="raised-button-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span">
                                Upload Image
                            </Button>
                        </label>
                        {image && <Typography variant="body2">{image.name}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleListProperty}
                        >
                            List Property
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary" gutterBottom align="center">
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default ListProperty;
