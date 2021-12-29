import React, { useState, useEffect} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link, useNavigate } from 'react-router-dom'

const TopNavbar = () => {

  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    if (searchQuery) {
      navigate(`/?query=${searchQuery}`)
      // window.location.href = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
    }
  }, [searchQuery])

  return (
    <Navbar variant="dark" className="px-4 bg-black fixed-top">
      <Nav.Link href="#home" className="h-100 ps-0">
        <img src="/assets/netflix_logo.png" alt="" className="navImage"/>
      </Nav.Link>
      <Nav className="w-100 text-white navLink d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">TV Shows</Nav.Link>
          <Nav.Link href="#features">Movies</Nav.Link>
          <Nav.Link href="#features">New & Popular</Nav.Link>
          <Nav.Link href="#features">My List</Nav.Link>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="border-1 border-white">
            <i className="bi bi-search mediumIcon"></i>
            <input className="bg-black border-0 text-white p-1 px-2" placeholder="Titles, people, genres" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onSubmit={(e) => setSearchQuery(e.target.value)}/>
          </div>
          <Nav.Link href="#features">Kids</Nav.Link>
          <Nav.Link href="#features">DVD</Nav.Link>
          <i className="bi bi-bell-fill mediumIcon"></i>
          

          <Dropdown>
            <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0 ">
              <img src="/assets/netflix_avatar.png" alt="" className="navImage"/>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" align="end">
              <Dropdown.Item href="#/action-1">
                <Link to="/profile">My Account</Link>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2">Help Center</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Sign Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

      </Nav>
    </Navbar>
  )
}

export default TopNavbar
