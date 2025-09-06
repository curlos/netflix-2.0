import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';

/**
 * @description - Page where the user can sign up with new credentials.
 * @returns {React.FC}
 */
const SignUp = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
        // If the user signed up successfully and now has an account with us, then redirect them to the login page where they can login with new account.
        navigate('/login');
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
        <button className="netflixRedButton">Sign Up</button>
      </div>

      <div className="container mx-auto px-3 px-sm-0 d-flex justify-content-center">
        <form className="authForm" onSubmit={handleRegister}>
          <div className="fs-2 fw-bold">Sign Up</div>

          <div className="my-3">
            <input ref={emailRef} type="text" className="w-100 mb-3 authInput" placeholder="Email" />
            <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password" />
          </div>

          <button className="w-100 my-4 netflixRedButton" type="submit">Sign Up</button>

          <div>
            <span className="text-lightgray">Have an account?</span>
            <Link to="/login" className="authLink">Login now.</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
