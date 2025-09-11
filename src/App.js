import React, { useEffect } from 'react';
import './styles.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home';
import AuthForm from './components/AuthForm';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import { login, logout } from './features/userSlice';
import Profile from './pages/Profile';
import Movies from './pages/browse/Movies';
import TVShows from './pages/browse/TVShows';
import Movie from './pages/Movie';
import TVShow from './pages/TVShow';
import TVEpisode from './pages/TVEpisode';
import Person from './pages/Person';


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    /**
     * 'onAuthStateChanged' is a method provided by Firebase that sets up a listener on the Firebase auth object.
     * This listener will be called whenever the user's sign-in-state changes.
     * It also returns a function (which we're calling 'unsubscribe') that can be used to unregister the listener.
     */
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      // If the 'userAuth' object exists, it means the user is currently logged in.
      if (userAuth) {
        // Dispatch the 'login' action to the Redux store with the user's ID and email as the payload.
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }));
      } else {
        // If 'userAuth' is null or undefined, it means the user is not currently logged in.
        // In this case, dispatch the 'logout' action to the Redux store.
        dispatch(logout());
      }
    });

    // Cleanup function used to unregister the listener from 'onAuthStateChanged'
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="bg-black text-white vw-100 vh-100 mw-100">

      {/* Different pages that a user can visit. */}
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/title/movie/:id" element={<Movie />} exact />
        <Route path="/title/tv/:id" element={<TVShow />} exact />
        <Route path="/title/tv/:id/season/:seasonNum/episode/:episodeNum" element={<TVEpisode />} />
        <Route path="/person/:personId" element={<Person />} exact />

        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
