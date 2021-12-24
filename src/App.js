import React, { useEffect } from 'react';
import axios from 'axios';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './styles.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'

const App = () => {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // Logged in
        console.log(userAuth)
      } else {
        // Logged out
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="bg-black text-white vw-100 vh-100">    
          
      <Routes>

        <Route path="/title/:id" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
