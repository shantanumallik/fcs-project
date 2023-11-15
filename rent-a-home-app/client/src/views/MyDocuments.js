import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const MyDocuments = ({ user }) => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/properties/user-contracts/${user.user._id}`);
                setContracts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch contracts. ' + err.message);
                setLoading(false);
            }
        };

        fetchContracts();
    }, [user.user._id]);

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>My Documents</Typography>
            {contracts.length === 0 ? (
                <Typography>You have no contracts at the moment.</Typography>
            ) : (
                <List>
                    {contracts.map((contract, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemText
                                    primary={`Contract for ${contract.title}`}
                                    secondary={`Contract URL: ${contract.contractUrl}`}
                                />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Container>
    );
}

export default MyDocuments;
