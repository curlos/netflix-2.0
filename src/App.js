import React, { useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import Home from './pages/Home';
import requests, { API_BASE_URL } from './requests';
import './styles.css'

const App = () => {
  useEffect(() => {
    const fetchFromAPI = async () => {
      const response = await axios.get(`${API_BASE_URL}${requests.fetchTrending.url}`)
      console.log(response.data)
    }
    fetchFromAPI()
  }, [])

  return (
    <div className="bg-black text-white vw-100 vh-100">
      <Router>
        <Home />
        
      
        <Routes>
          <Route path="/" component={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
