import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux'
import { login } from '../features/userSlice'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignIn = (e) => {
    e.preventDefault()

    console.log('clicked bitch')

    signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      )
      .then((authUser) => {
        console.log(authUser)
        dispatch(login({
          uid: authUser.user.uid,
          email: authUser.user.email,
        }))
        navigate('/')
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

      <form className="bg-black authForm p-5" onSubmit={handleSignIn}>
        <div className="fs-2 fw-bold">Sign In</div>

        <input ref={emailRef} type="text" className="w-100 mb-3 authInput" placeholder="Email"/>
        <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password"/>

        <button type="submit" className="w-100 my-4 netflixRedButton" onClick={handleSignIn}>Sign In</button>

        <div>
          <span className="text-lightgray">New to Netflix?</span> 
          <Link to="/signup" className="authLink">Sign Up now.</Link>
        </div>
      </form>
    </div>
  )
}

export default Login
