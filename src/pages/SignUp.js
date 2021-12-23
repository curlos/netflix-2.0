import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="authPage d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-between fixed-top p-4">
        <img src="/assets/netflix_logo.png" alt="" className="authLogo"/>
        <button className="netflixRedButton">Sign Up</button>
      </div>

      <form className="bg-black authForm p-5">
        <div className="fs-2 fw-bold">Sign Up</div>

        <div className="my-3">
          <input type="text" className="w-100 mb-3 authInput" placeholder="Email"/>
          <input type="password" className="w-100 authInput" placeholder="Password"/>
        </div>

        <div className="w-100 my-4 netflixRedButton">Sign Up</div>

        <div>
          <span className="text-lightgray">Have an account?</span> 
          <Link to="/login" className="authLink">Login now.</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
