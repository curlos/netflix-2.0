import React, { useState, useEffect} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/userSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'

const TopNavbar = () => {

  const user = useSelector(selectUser)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (searchQuery) {
      navigate(`/?query=${searchQuery}`)
    }
  }, [searchQuery])

  console.log(user)

  return (
    <Navbar variant="dark" className="px-5 bg-black fixed-top topNavbar">
      <Nav.Link className="h-100 ps-0">
        <Link to="/" className="navLink">
          <img src="/assets/netflix_logo.png" alt="" className="navImage"/>
        </Link>
      </Nav.Link>
      <Nav className="w-100 text-white navLink d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <Nav.Link>
            <Link to="/" className="navLink">Home</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/tv-shows" className="navLink">TV Shows</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/movies" className="navLink">Movies</Link>
          </Nav.Link>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="border border-white px-2 py-1">
            <i className="bi bi-search mediumIcon"></i>
            <input autoFocus={true} className="bg-black border-0 text-white p-1 px-2" placeholder="Titles, people, genres" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onSubmit={(e) => setSearchQuery(e.target.value)} />
          </div>

          {user && user.email ? (
            <Dropdown>
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0 ">
                <img src="/assets/netflix_avatar.png" alt="" className="navImage"/>
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <Dropdown.Item>
                  <Link to="/profile">My Account</Link>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => dispatch(logout)}><Link to="/login">Sign Out</Link></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <span className="d-flex">
              <Nav.Link>
                <Link to="/login" className="navLink">Login</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/signup" className="navLink">Sign Up</Link>
              </Nav.Link>
            </span>
          )}
        </div>

      </Nav>
    </Navbar>
  )
}

export default TopNavbar
