import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSignIn = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser)
      })
      .catch((error) => {
        alert(error.message)
      })
    
  }

  return (
    <div className="authPage d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-between fixed-top p-4">
        <img src="/assets/netflix_logo.png" alt="" className="authLogo"/>
        <button className="netflixRedButton">Sign In</button>
      </div>

      <form className="bg-black authForm p-5">
        <div className="fs-2 fw-bold">Sign In</div>

        <div className="my-3">
          <input ref={emailRef} type="text" className="w-100 mb-3 authInput" placeholder="Email"/>
          <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password"/>
        </div>

        <div className="w-100 my-4 netflixRedButton" onClick={handleSignIn}>Sign In</div>

        <div>
          <span className="text-lightgray">New to Netflix?</span> 
          <Link to="/signup" className="authLink">Sign Up now.</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
