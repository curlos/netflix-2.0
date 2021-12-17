import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import Navbar from './components/Navbar';
import './styles.css'

const App = () => {
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
