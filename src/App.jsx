import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { Allroutes } from './routes/Allroutes';

function App() {
  return (
    <div>
    <Navbar />
    <Allroutes />
    </div>
  )
}

export default App
