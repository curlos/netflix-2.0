
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { logout } from '../features/userSlice';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const SideNavbar = ({ open, setOpen }) => {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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
    <div id="mySidenav" class={`sidenav ${open ? 'sidenavOpen' : ''}`}>
      <button class="closebtn" onClick={() => setOpen(false)}>&times;</button>
      <Link to="/movies">Movies</Link>
      <Link to="/tv-shows">TV Shows</Link>
      {user && user.email ? (
        <span>
          <Link to="/profile">My Account</Link>
          <div className="sidenavLogout" onClick={handleLogout}>Logout</div>
        </span>
      ) : (
        <span>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </span>
      )}
    </div>
  );
};

export default SideNavbar;
