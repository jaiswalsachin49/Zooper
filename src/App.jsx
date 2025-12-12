import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { Allroutes } from './routes/Allroutes';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/react";
import DetailModal from './components/DetailModal';
import { useModal } from './context/ModalContext';

function App() {
  const [disclaimer, setDisclaimer] = useState(true);
  const { isOpen, content, closeModal } = useModal();

  const handleClick = () => setDisclaimer(false);

  useEffect(() => {
    document.body.style.overflow = disclaimer ? "hidden" : "auto";
  }, [disclaimer]);

  return (
    <div className="relative">
      {disclaimer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 px-4"
        >
          <div className="p-6 rounded-lg shadow-xl max-w-xl text-center 
                          ring-[0.5px] ring-gray-100 bg-[#111]/80 
                          backdrop-blur-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-semibold mb-4 text-white">Disclaimer</h2>
            <p className="mb-6 text-md text-white leading-relaxed">
              This project is made solely for educational and personal learning purposes.
              I do not support or promote piracy, unauthorized distribution, or the misuse
              of any software, assets, or content. All resources and demonstrations here
              are intended to help developers learn within legal and ethical boundaries.
            </p>
            <button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition duration-200 cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <Navbar />
      <Allroutes />
      <Footer />
      <Analytics />
      <DetailModal isOpen={isOpen} onClose={closeModal} content={content} />
    </div>
  );
}

export default App;
