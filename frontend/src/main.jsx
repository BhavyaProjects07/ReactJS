import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat.jsx";
import TextToSpeech from "./pages/TextToSpeech"
import Contact from "./pages/Contact.jsx";


import { GoogleOAuthProvider } from "@react-oauth/google";


// Replace with your real Google Client ID
const GOOGLE_CLIENT_ID = "101879669450-96er7jss0d0s514erq5doivq9aq5gbrk.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);


