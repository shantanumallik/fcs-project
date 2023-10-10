import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    AppBar, Toolbar, Button, Typography, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, IconButton 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';

import './css/Navigation.css';

function Navigation({ user, setUser }) {
    const [open, setOpen] = useState(false); // State to handle Dialog's open/close
    const [anchorEl, setAnchorEl] = useState(null); // For user dropdown menu
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
        setOpen(false); // Close the dialog
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/">
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Rent-A-Home
                </Typography>

                {user ? (
                    <>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-haspopup="true"
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>
                                <Typography variant="body1">
                                    Welcome, {user.user.username}
                                </Typography>
                            </MenuItem>
                            <MenuItem component={Link} to="/properties">View Properties</MenuItem>
                            {user.user.userType === 'seller_renter' && (
                                <>
                                    <MenuItem component={Link} to="/list-property">List Property</MenuItem>
                                    <MenuItem component={Link} to={`/dashboard/${user.user._id}`}>Dashboard</MenuItem>
                                </>
                            )}
                            <MenuItem onClick={handleOpen}>
                                <ExitToAppIcon sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>

                        {/* Logout Confirmation Dialog */}
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to log out?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={handleLogout} color="primary" autoFocus>
                                    Logout
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                ) : (
                    <>
                        <Button variant="outlined" color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup" sx={{ ml: 1 }}>Signup</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
