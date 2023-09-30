import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Signup from './components/Signup';
import Login from './components/Login';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <Container maxWidth="sm" sx={{ mt: 5 }}> {/* Using Container for consistent spacing */}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
