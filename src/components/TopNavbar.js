import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import { useSelector } from 'react-redux';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { selectUser } from '../features/userSlice';
import SideNavbar from './SideNavbar';

const TopNavbar = () => {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInput, setShowInput] = useState(false);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      navigate(`/?query=${searchQuery}`);
    }
  }, [navigate, searchQuery]);

  useEffect(() => {
    if (searchParams && searchParams.get('query') && searchParams.get('query').length === 1) {
      setSearchQuery(searchParams.get('query'));
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Navbar variant="dark" className="px-3 px-md-5 bg-black fixed-top topNavbar">
      <Nav.Link className="h-100 ps-0 d-flex align-items-center">
        <Link to="/" className="navLink">
          <img src="/assets/netflix_logo.png" alt="" className="navImage" />
        </Link>
      </Nav.Link>
      <Nav className="w-100 text-white navLink d-flex justify-content-between align-items-center">
        <div className="d-none d-md-flex">
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

        <div className="d-block d-lg-none" />

        <div className="d-flex align-items-center gap-3">
          <div className="px-2 py-1">
            <i className="bi bi-search mediumIcon cursor-pointer" onClick={() => setShowInput(!showInput)}></i>
            <input autoFocus={searchParams.get('query') && searchParams.get('query').length > 0} className={`bg-black border-0 text-white searchInput ${showInput ? 'fullInput p-1 px-2' : ''}`} placeholder="Titles, people, genres" value={searchQuery} onChange={(e) => {
              setSearchQuery(e.target.value);
              // if (e.target.value[e.target.value.length - 1] === ' ') {
              //   navigate(`/?query=${e.target.value} `)
              // } else {
              //   navigate(`/?query=${e.target.value}`)
              // }
            }} onSubmit={(e) => navigate(`/?query=${e.target.value}`)} />
          </div>

          {user && user.email ? (
            <Dropdown className="d-none d-sm-block">
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0 ">
                <img src="/assets/netflix_avatar.png" alt="" className="navImage" />
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <Dropdown.Item>
                  <Link to="/profile">My Account</Link>
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}><span>Sign Out</span></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <span className="d-none d-sm-flex">
              <Nav.Link>
                <Link to="/login" className="navLink">Login</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/signup" className="navLink">Sign Up</Link>
              </Nav.Link>
            </span>
          )}

          <div className="d-sm-none" onClick={() => setOpen(true)}>
            <i class="bi bi-list fs-3"></i>
          </div>
        </div>

      </Nav>

      <SideNavbar open={open} setOpen={setOpen} />
    </Navbar>
  );
};

export default TopNavbar;
