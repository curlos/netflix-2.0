import React, { useEffect } from 'react';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Genres from './pages/browse/Genres';
import './styles.css'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'
import { useDispatch } from 'react-redux';
import { login, logout } from './features/userSlice'
import Profile from './pages/Profile';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux'
import { selectUser } from './features/userSlice'
import Movies from './pages/browse/Movies'
import TVShows from './pages/browse/TVShows'


const App = () => {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // Logged in
        console.log(userAuth)
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }))
      } else {
        // Logged out
        dispatch(logout)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="bg-black text-white vw-100 vh-100">    
          
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/browse/movies" element={<Movies />} />
        <Route path="/browse/tv" element={<TVShows />} />
        <Route path="/title/:id" element={<Home />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
