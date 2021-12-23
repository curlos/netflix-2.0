import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import './styles.css'

const App = () => {

  return (
    <div className="bg-black text-white vw-100 vh-100">    
          
      <Routes>

        <Route path="/title/:id" element={<Home />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
