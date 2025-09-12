
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import { selectUser } from '../features/userSlice';
import { logout } from '../features/userSlice';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

/**
 * @description - 
 * @returns {React.FC}
 */
const SideNavbar = ({ open, setOpen }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const sidenavRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && sidenavRef.current && !sidenavRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <>
      {open && <div className="sidenav-overlay" onClick={() => setOpen(false)} />}
      <div ref={sidenavRef} id="mySidenav" className={`sidenav ${open ? 'sidenavOpen' : ''}`}>
        <button className="closebtn" onClick={() => setOpen(false)}>&times;</button>
        <Link to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link to="/movies" onClick={() => setOpen(false)}>Movies</Link>
        <Link to="/tv-shows" onClick={() => setOpen(false)}>TV Shows</Link>
        {user && user.email ? (
          <span>
            <Link to="/profile" onClick={() => setOpen(false)}>My Account</Link>
            <div className="sidenavLogout" onClick={handleLogout}>Sign Out</div>
          </span>
        ) : (
          <span>
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
          </span>
        )}
      </div>
    </>
  );
};

export default SideNavbar;
