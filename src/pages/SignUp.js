import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const SignUp = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleRegister = (e) => {
    e.preventDefault()

    createUserWithEmailAndPassword(
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

  useEffect(() => {
    window.scrollTo(0,0)
  }, [])

  return (
    <div className="authPage d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-between fixed-top p-4">
        <Link to="/">
          <img src="/assets/netflix_logo.png" alt="" className="authLogo"/>
        </Link>
        <button className="netflixRedButton">Sign Up</button>
      </div>

      <form className="bg-black authForm p-5">
        <div className="fs-2 fw-bold">Sign Up</div>

        <div className="my-3">
          <input ref={emailRef} type="text" className="w-100 mb-3 authInput" placeholder="Email"/>
          <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password"/>
        </div>

        <div className="w-100 my-4 netflixRedButton" onClick={handleRegister}>Sign Up</div>

        <div>
          <span className="text-lightgray">Have an account?</span> 
          <Link to="/login" className="authLink">Login now.</Link>
        </div>
      </form>
    </div>
  )
}

export default SignUp
