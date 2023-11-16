import React, { useState } from 'react';
import { 
    TextField, Button, Container, Typography, Grid, 
    Paper, Box, FormControlLabel, Checkbox, RadioGroup, 
    FormControl, FormLabel, Radio 
} from '@mui/material';
import { handleListProperty, handleFileChange } from '../controllers/PropertyController';
import './css/ListProperty.css';

const ListProperty = ({ user }) => {
    const today = new Date();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState('');
    const [amenities, setAmenities] = useState({ pool: false, gym: false, wifi: false });
    const [availabilityDate, setAvailabilityDate] = useState(today.toISOString().split('T')[0]);
    const [propertyType, setPropertyType] = useState('rent'); // Property type: rent or sale
    const [message, setMessage] = useState('');

    const onSubmit = () => {
        //console.log("Availability: " + availabilityDate);
        handleListProperty(
            title, 
            description, 
            price, 
            location, 
            amenities, 
            availabilityDate, 
            propertyType, 
            user.user._id, 
            image, 
            setMessage
        );
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
                            onChange={(event) => handleFileChange(event, setImage)}
                        />
                        <label htmlFor="raised-button-file">
                            <Button variant="contained" component="span">
                                Upload Image
                            </Button>
                        </label>
                        {image && <Typography variant="body2">{image.name}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Location"
                            variant="outlined"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Date of Availability"
                            variant="outlined"
                            type="date"
                            value={availabilityDate}
                            onChange={(e) => {
                                setAvailabilityDate(e.target.value);
                                //console.log(e.target.value);
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Amenities:
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={amenities.pool} 
                                    onChange={(e) => setAmenities(prev => ({ ...prev, pool: e.target.checked }))}
                                />
                            }
                            label="Pool"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={amenities.gym} 
                                    onChange={(e) => setAmenities(prev => ({ ...prev, gym: e.target.checked }))}
                                />
                            }
                            label="Gym"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={amenities.wifi} 
                                    onChange={(e) => setAmenities(prev => ({ ...prev, wifi: e.target.checked }))}
                                />
                            }
                            label="Wi-Fi"
                        />
                        {/* Add more amenities as needed */}
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Property Type</FormLabel>
                            <RadioGroup 
                                row 
                                aria-label="propertyType" 
                                name="propertyType" 
                                value={propertyType} 
                                onChange={(e) => setPropertyType(e.target.value)}
                            >
                                <FormControlLabel value="rent" control={<Radio />} label="For Rent" />
                                <FormControlLabel value="sale" control={<Radio />} label="For Sale" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {/* Amenities */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Amenities:
                        </Typography>
                        <FormControlLabel
                            control={<Checkbox checked={amenities.pool} onChange={(e) => setAmenities(prev => ({ ...prev, pool: e.target.checked }))} />}
                            label="Pool"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={amenities.gym} onChange={(e) => setAmenities(prev => ({ ...prev, gym: e.target.checked }))} />}
                            label="Gym"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={amenities.wifi} onChange={(e) => setAmenities(prev => ({ ...prev, wifi: e.target.checked }))} />}
                            label="Wi-Fi"
                        />
                        {/* Add more amenities as needed */}
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={onSubmit}
                        >
                            List Property
                        </Button>
                    </Grid>

                    {/* Message Display */}
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
