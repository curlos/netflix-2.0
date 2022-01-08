import React, { useState, useEffect } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link, useNavigate } from 'react-router-dom'
import Plans from '../components/Plans'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { logout } from '../features/userSlice'

const Profile = () => {
  const user = useSelector(selectUser)
  const [currentEmail, setCurrentEmail] = useState(user && user.email)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      console.log(auth)
      await signOut(auth)
      dispatch(logout)
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!user || !currentEmail) {
      navigate('/')
    }

    window.scrollTo(0,0)
  }, [currentEmail, navigate, user])
  
  return (
    user ? (
      <div className="d-flex justify-content-center align-items-center profilePage">
        <div className="fixed-top p-4">
          <Link to="/">
            <img src="/assets/netflix_logo.png" alt="" className="profileNetflixLogo"/>
          </Link>
        </div>

        <div className="profileContainer p-2 p-lg-4 overflow-auto navbarMarginTwo">
          <h1>Edit Profile</h1>
          <div className="d-lg-flex gap-4">
            <div className="mb-4 mb-lg-0">
              <img src="/assets/netflix_avatar.png" alt="" className="profileProfileUserAvatar" />
            </div>

            <div className="w-100">
              <input className="profileInput mb-4 text-white" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)}/>

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
    
  )
}

export default Profile