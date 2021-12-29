import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom'
import Plans from '../components/Plans'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'

const Profile = () => {
  const user = useSelector(selectUser)
  const [currentEmail, setCurrentEmail] = useState(user && user.email)
  
  if (!currentEmail) {
    return
  }
  
  return (
    <div className="d-flex justify-content-center align-items-center profilePage">
      <div className="fixed-top p-4">
        <Link to="/">
          <img src="/assets/netflix_logo.png" alt="" className="profileNetflixLogo"/>
        </Link>
      </div>

      <div className="w-75 h-75 border p-4 overflow-auto">
        <h1>Edit Profile</h1>
        <div className="d-flex gap-4">
          <div>
            <img src="/assets/netflix_avatar.png" alt="" className="profileProfileUserAvatar" />
          </div>

          <div className="w-100">
            <input className="profileInput mb-4 text-white" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)}/>

            <div className="text-lightgray mb-2">Language:</div>

            <Dropdown>
              <Dropdown.Toggle className="dropdownButton fs-md">
                English
              </Dropdown.Toggle>

              <Dropdown.Menu variant="dark" className="dropdownMenu">
                <div className="d-flex dropdownMenuContainer">
                  <div>
                    <Dropdown.Item href="#/action-2">Bahasa Indonesia</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Bahasa Melayu</Dropdown.Item>
                  </div>

                  <div>
                    <Dropdown.Item href="#/action-4">Suomi</Dropdown.Item>
                    <Dropdown.Item href="#/action-5">Svenska</Dropdown.Item>
                  </div>
                </div>

            
              </Dropdown.Menu>
            </Dropdown>

            <hr />

            <div className="space-between-y-3">
              <div className="text-lightgray">Maturity Settings:</div>
              <div>
                <span className="p-2 bg-secondary fs-md">All Maturity Ratings</span>
              </div>
              <div className="fs-xs">Show titles of all maturity ratings for this profile.</div>
              
              <button type="button" className="bg-black text-white p-1 px-3 border border-secondary">Edit</button>
            </div>

            <hr />

            <div>
              <div className="text-lightgray">Autoplay controls</div>
              <div className="d-flex align-items-center gap-1">
                <div><input type="checkbox" /></div>
                <div className="fs-xs">Autoplay next episode in a series on all devices</div>
              </div>

              <div className="d-flex align-items-center gap-1">
                <div><input type="checkbox" /></div>
                <div className="fs-xs">Autoplay next episode in a series on all devices</div>
              </div>
            </div>

            <hr />

            <Plans />
          </div>
        </div>
        
        <hr />

        <div className="d-flex justify-content-center gap-2">
          <button type="button" className="profileBottomButton profileSaveButton">Save</button>

          <button type="button" className="profileBottomButton">Cancel</button>

          <button type="button" className="profileBottomButton">Sign Out</button>

          <button type="button" className="profileBottomButton">Delete Profile</button>
        </div>
      </div>
    </div>
  )
}

export default Profile