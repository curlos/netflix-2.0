import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { logout } from '../features/userSlice';
import { useSelector } from 'react-redux';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { selectUser } from '../features/userSlice';
import SideNavbar from './SideNavbar';

/**
 * @description - 
 * @returns {React.FC}
 */
const TopNavbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showInput, setShowInput] = useState(false);
  const searchContainerRef = useRef(null);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const debouncedNavigate = useCallback(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    debounce((query) => {
      if (query) {
        navigate(`/?query=${query}`);
      }
    }, 1000),
    [navigate]
  );

  useEffect(() => {
    debouncedNavigate(searchQuery);
  }, [searchQuery, debouncedNavigate]);

  useEffect(() => {
    if (searchParams && searchParams.get('query') && searchParams.get('query').length === 1) {
      setSearchQuery(searchParams.get('query'));
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

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
    <Navbar variant="dark" className="bg-black fixed-top topNavbar">
      <Nav className="w-100 text-white navLink d-flex justify-content-between align-items-center container mx-auto px-3 px-sm-0">
        <Link to="/" className="navLink h-100 ps-0 d-flex align-items-center me-2 d-md-none">
          <img src="/assets/netflix_logo.png" alt="" className="navImage" />
        </Link>

        <div className="d-none d-md-flex">
          <Link to="/" className="navLink h-100 ps-0 d-flex align-items-center me-2">
            <img src="/assets/netflix_logo.png" alt="" className="navImage" />
          </Link>
          <Link to="/" className="navLink nav-link">Home</Link>
          <Link to="/tv-shows" className="navLink nav-link">TV Shows</Link>
          <Link to="/movies" className="navLink nav-link">Movies</Link>
        </div>

        <div className="d-block d-lg-none" />

        <div className="d-flex align-items-center gap-3">
          <div className={`px-2 py-1 ${showInput ? 'border' : ''}`} ref={searchContainerRef}>
            <i className="bi bi-search mediumIcon cursor-pointer" onClick={() => setShowInput(!showInput)}></i>
            <input autoFocus={searchParams.get('query') && searchParams.get('query').length > 0} className={`bg-black border-0 text-white searchInput ${showInput ? 'fullInput p-1 px-2' : ''}`} placeholder="Titles, people, genres" value={searchQuery} onChange={(e) => {
              setSearchQuery(e.target.value);
            }} onSubmit={(e) => navigate(`/?query=${e.target.value}`)} />
          </div>

          {user && user.email ? (
            <Dropdown className="d-none d-sm-block">
              <Dropdown.Toggle variant="transparent text-white d-flex align-items-center gap-1 border-0" id="dropdown-basic" className="p-0 ">
                <img src="/assets/netflix_avatar.png" alt="" className="navImage" />
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" align="end">
                <Dropdown.Item as={Link} to="/profile">
                  My Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}><span>Sign Out</span></Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <span className="d-none d-sm-flex">
              <Link to="/login" className="navLink nav-link">Login</Link>
              <Link to="/signup" className="navLink nav-link">Sign Up</Link>
            </span>
          )}

          <div className="d-sm-none" onClick={() => setOpen(true)}>
            <i className="bi bi-list fs-3"></i>
          </div>
        </div>

      </Nav>

      <SideNavbar open={open} setOpen={setOpen} />
    </Navbar>
  );
};

export default TopNavbar;
