import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'

const TopNavbar = () => {
  return (
    <Navbar variant="dark" className="px-4 bg-black">
      <Nav.Link href="#home" className="h-100">
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
          <i className="bi bi-search mediumIcon"></i>
          <Nav.Link href="#features">Kids</Nav.Link>
          <Nav.Link href="#features">DVD</Nav.Link>
          <i className="bi bi-bell-fill mediumIcon"></i>
          

          <Dropdown>
            <Dropdown.Toggle variant="transparent text-white dropdownButtonTop d-flex align-items-center gap-1" id="dropdown-basic" className="p-0 ">
              <img src="/assets/netflix_avatar.png" alt="" className="navImage"/>
            </Dropdown.Toggle>

            <Dropdown.Menu variant="dark" align="end">
              <Dropdown.Item href="#/action-1">Account</Dropdown.Item>
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
