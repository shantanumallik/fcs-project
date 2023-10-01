import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Navigation from './components/Navigation';
import PegasusPage from './components/PegasusPage';
import ListProperty from './components/ListProperty'; 
import Properties from './components/Properties'; 
import PropertyDetails from './components/PropertyDetails';

function App() {
  const [user, setUser] = useState(null); // To store the user's data

  return (
    <Router>
      <Navigation user={user} setUser={setUser} />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/pegasus" element={<PegasusPage />} />
        <Route path="/list-property" element={<ListProperty user={user} />} /> 
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:propertyId" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
