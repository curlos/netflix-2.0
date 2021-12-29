import React, { useState, useEffect } from 'react'
import TopNavbar from '../components/TopNavbar'
import Banner from '../components/Banner'
import requests, { API_BASE_URL } from '../requests'
import ContentCarousel from '../components/ContentCarousel'
import {
  useParams,
  useNavigate
} from "react-router-dom";
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'

const Home = () => {
  const { id } = useParams()
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('fuck ing')
    console.log(user)

    // if (!user) {
    //   navigate('/login')
    // }

  }, [id, user])

  return (
    <div className="bg-black vw-100">
      <TopNavbar />
      <Banner />

      <div className="p-3">
        {Object.values(requests).map((request) => (
          <ContentCarousel apiUrl={API_BASE_URL + request.url} name={request.name} />
        ))}
      </div>
    </div>
  )
}

export default Home
