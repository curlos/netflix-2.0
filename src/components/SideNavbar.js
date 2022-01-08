import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login, logout } from '../features/userSlice'

const SideNavbar = ({ open, setOpen, user }) => {

  const dispatch = useDispatch()

  return (
    <div id="mySidenav" class={`sidenav ${open ? 'sidenavOpen' : ''}`}>
      <Link to="/" class="closebtn" onClick={() => setOpen(false)}>&times;</Link>
      <Link to="/movies">Movies</Link>
      <Link to="/tv-shows">TV Shows</Link>
      {user && user.email ? (
        <span>
          <Link to="/profile">My Account</Link>
          <Link to="/logout" onClick={() => dispatch(logout)}>Logout</Link>
        </span>
      ) : (
        <span>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </span>
      )}
    </div>
  )
}

export default SideNavbar
