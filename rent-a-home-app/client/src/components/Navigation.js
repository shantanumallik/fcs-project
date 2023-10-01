import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function Navigation({ user, setUser }) {
    const [open, setOpen] = useState(false); // State to handle Dialog's open/close
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

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Rent-A-Home
                </Typography>
                
                {user ? (
                    <>
                        <Typography variant="body1" sx={{ marginRight: 2 }}>
                            Welcome {user.username}
                        </Typography>
                        <Button color="inherit" onClick={handleOpen}>Logout</Button>

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
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/signup">Signup</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navigation;
