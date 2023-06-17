import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(
      auth,
      emailRef.current.value,
      passwordRef.current.value
    )
      .then((authUser) => {
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
      <div className="d-flex justify-content-between fixed-top p-4">
        <Link to="/">
          <img src="/assets/netflix_logo.png" alt="" className="authLogo" />
        </Link>
        <button className="netflixRedButton">Sign In</button>
      </div>

      <form className="authForm" onSubmit={handleSignIn}>
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
  );
};

export default Login;
