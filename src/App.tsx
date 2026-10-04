import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { CustomCursor } from './components/layout/CustomCursor';
import { TransitionOverlay } from './components/chat/TransitionOverlay';

export const App: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <TransitionOverlay />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
