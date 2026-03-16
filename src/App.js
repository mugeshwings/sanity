// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Components/HomePage";
import "./Components/Home.css";
import Contact from "./Components/contact";
import Insights from "./Components/insights/Insights";
import InsightDetail from "./Components/insights/insightDetail";
import About from "./Components/About/about";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<Contact />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insight/:slug" element={<InsightDetail   />} />
                  <Route path="/about" element={<About   />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
