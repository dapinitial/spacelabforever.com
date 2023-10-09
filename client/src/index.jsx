import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import 'the-new-css-reset/css/reset.css';
import './styles/index.scss';
import NeonCursor from './components/NeonCursor';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Layout/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
// import Breadcrumb from './components/Breadcrumb';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTopButton />
      <AudioPlayer />
      <Footer />
      {/* <Breadcrumb /> */}
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

createRoot(document.getElementById('neon-cursor-root')).render(
  <NeonCursor />
);
