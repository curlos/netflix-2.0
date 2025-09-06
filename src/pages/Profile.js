import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Plans from '../components/Plans';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { logout } from '../features/userSlice';

/**
 * @description - Page where the user can view their profile and their plans. They can subscribe to a different plan and also sign out.
 * @returns {React.FC}
 */
const Profile = () => {
  const user = useSelector(selectUser);
  const email = user && user.email;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * @description - Logout the user.
   */
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
    if (!user || !email) {
      navigate('/');
    }

    window.scrollTo(0, 0);
  }, [email, navigate, user]);

  return (
    user ? (
      <div className="d-flex justify-content-center align-items-center container mx-auto px-3 px-sm-0 bg-black">
         <div className="d-flex justify-content-between fixed-top p-4 container mx-auto px-3 px-sm-0 bg-black">
          <Link to="/">
            <img src="/assets/netflix_logo.png" alt="" className="authLogo" />
          </Link>
        </div>

        <div className="w-100 p-2 p-lg-4 overflow-auto navbarMarginTwo">
          <h1 className="mb-4">Edit Profile</h1>
          <div className="d-lg-flex gap-4">
            <div className="mb-4 mb-lg-0">
              <img src="/assets/netflix_avatar.png" alt="" className="profileProfileUserAvatar" />
            </div>

            <div className="w-100">
              <input className="profileInput mb-4 text-white" value={email} readonly="readonly" />

              <hr />

              <Plans />
            </div>
          </div>

          <hr />

          <div className="d-flex flex-column flex-lg-row justify-content-center gap-2">
            <button type="button" className="profileBottomButton" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    ) : null

  );
};

export default Profile;