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

function App() {
  const [user, setUser] = useState(null);
useEffect(() =>{
//console.log('user:' + user)
}, [user])

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
        <Route path="/properties/:propertyId" element={<PropertyDetails />} />
        <Route path="/dashboard/:sellerId" element={<SellerDashboard user={user}/>} />
      </Routes>
    </Router>
  );
}

export default App;
