import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Allroutes } from './routes/Allroutes';

function App() {
  return (
    <Router>
    <Navbar />
    <Allroutes />
    </Router>
  )
}

export default App
