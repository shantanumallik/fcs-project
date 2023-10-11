import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper, Box } from '@mui/material';
import { handleListProperty, handleFileChange } from '../controllers/PropertyController';
import './css/ListProperty.css'; 

const ListProperty = ({ user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);  
    const [message, setMessage] = useState('');

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
                            onChange={(event) => handleFileChange(event, setImage)}
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
                            onClick={() => handleListProperty(title, description, price, user.user._id, image, setMessage)}
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
