import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './views/Signup';
import Login from './views/Login';
import Navigation from './views/Navigation';
import PegasusPage from './views/PegasusPage';
import ListProperty from './views/ListProperty'; 
import Properties from './views/Properties'; 
import PropertyDetails from './views/PropertyDetails';
import SellerDashboard from './views/SellerDashboard.js';
import EditProfile from './views/EditProfile.js';
import MyDocuments from './views/MyDocuments.js';
import Cookies from 'js-cookie';

function App() {
  const [user, setUser] = useState(() => {
    // Load user from cookies on initial render
    const savedUser = Cookies.get('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      // Save user to cookies when user state updates
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Expires in 7 days
    } else {
      // Clear user cookie when user logs out
      Cookies.remove('user');
    }
  }, [user]);

  return (
    <Router>
      <Navigation user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Properties />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/pegasus" element={<PegasusPage />} />
        <Route path="/list-property" element={<ListProperty user={user} />} /> 
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:propertyId" element={<PropertyDetails user={user} />} />
        <Route path="/dashboard/:sellerId" element={<SellerDashboard user={user}/>} />
        <Route path="/edit-profile/:userId" element={<EditProfile user={user} />} />
        <Route path="/docs/:userId" element={<MyDocuments user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
