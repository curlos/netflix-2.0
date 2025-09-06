import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';

/**
 * @description - Page where the user can login with their existing credentials.
 * @returns {React.FC}
 */
const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    // Call the firebase function to sign them in with email and password.
    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        // If we get to this point, this must mean that the login with the user was successful, meaning we can put their credentials into the redux user reducer and go to the home page.
        dispatch(login({
          uid: authUser.user.uid,
          email: authUser.user.email,
        }));
        navigate('/');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="authPage d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-between fixed-top p-4 container mx-auto px-3 px-sm-0">
        <Link to="/">
          <img src="/assets/netflix_logo.png" alt="" className="authLogo" />
        </Link>
        <button className="netflixRedButton">Sign In</button>
      </div>

      <div className="container mx-auto px-3 px-sm-0 d-flex justify-content-center">
        <form className="authForm w-100" onSubmit={handleSignIn}>
          <div className="fs-2 fw-bold">Sign In</div>

          <input ref={emailRef} type="text" className="w-100 my-3 authInput" placeholder="Email" />
          <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password" />

          <button type="submit" className="w-100 my-4 netflixRedButton" onClick={handleSignIn}>Sign In</button>

          <div>
            <span className="text-lightgray">New to Netflix?</span>
            <Link to="/signup" className="authLink">Sign Up now.</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
