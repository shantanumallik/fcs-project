import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EditProfile({ user }) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Initialize form with current user data
        setEmail(user.user.email || "NA");
        setPhone(user.user.phone || "NA");
        setAddress(user.user.address || "NA");
        setUserType(user.user.userType || "NA");
    }, [user]);

    const validateInput = () => {
        // Email Validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email || !emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
    
        // Phone Validation
        // This is a basic example and might need to be adjusted based on your requirements
        const phoneRegex = /^[0-9]{10}$/; // Adjust regex based on expected phone number format
        if (!phone || !phoneRegex.test(phone)) {
            setError('Please enter a valid phone number');
            return false;
        }
    
        // Address Validation
        // Basic check for address length
        if (!address || address.length < 5) {
            setError('Address is too short');
            return false;
        }
    
        setError('');
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        if (!validateInput()) {
            return;
        }

        try {
            const response = await axios.put(`/api/users/${user._id}`, {
                email, phone, address, userType
            });
            setSuccess('Profile updated successfully!');
            // Update local user state if needed
        } catch (error) {
            console.error(error);
            setError('Failed to update profile. Please try again.');
        }
    };

    return (
        <div>
            <h2>Edit Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label>Phone:</label>
                <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                />

                <label>Address:</label>
                <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                />

                <label>User Type:</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                    <option value="seller_renter">Seller/Renter</option>
                    <option value="buyer_rentee">Buyer/Rentee</option>
                </select>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProfile;
