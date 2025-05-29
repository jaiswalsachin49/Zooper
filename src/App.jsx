import React from 'react';
import Navbar from './components/Navbar';
import { Allroutes } from './routes/Allroutes';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <div>
    <Navbar />
    <Allroutes />
    <Footer />
    <Analytics />
    </div>
  )
}

export default App
