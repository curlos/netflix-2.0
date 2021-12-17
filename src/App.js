import React, { useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import Navbar from './components/Navbar';
import requests from './requests';
import './styles.css'

const App = () => {

  const API_BASE_URL = `https://api.themoviedb.org/3`

  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`${API_BASE_URL}${requests.fetchTrending}`)
      console.log(response.data)
    }
    fetchFromAPI()
  }, [])

  return (
    <div className="bg-dark text-white vw-100 vh-100">
      <Router>
        
        <Navbar />
      
        <Routes>
          <Route path="/" component={<Navbar />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
