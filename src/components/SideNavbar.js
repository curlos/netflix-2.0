import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../features/userSlice'
import { login, logout } from '../features/userSlice'

const SideNavbar = ({ open, setOpen }) => {

  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  console.log(user)

  return (
    <div id="mySidenav" class={`sidenav ${open ? 'sidenavOpen' : ''}`}>
      <Link to="/" class="closebtn" onClick={() => setOpen(false)}>&times;</Link>
      <Link to="/movies">Movies</Link>
      <Link to="/tv-shows">TV Shows</Link>
      {user && user.email ? (
        <span>
          <Link to="/profile">My Account</Link>
          <div onClick={() => {
            console.log(user)
            dispatch(logout)
            console.log(user)
          }}>Logout</div>
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
