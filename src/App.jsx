import React from 'react';
import Navbar from './components/Navbar';
import { Allroutes } from './routes/Allroutes';
import Footer from './components/Footer';

function App() {
  return (
    <div>
    <Navbar />
    <Allroutes />
    <Footer />
    </div>
  )
}

export default App
