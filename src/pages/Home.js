import React, { useState, useEffect } from 'react'
import TopNavbar from '../components/TopNavbar'
import Banner from '../components/Banner'
import requests, { API_BASE_URL } from '../requests'
import ContentCarousel from '../components/ContentCarousel'
import {
  useParams,
  useNavigate
} from "react-router-dom";

const Home = () => {
  const { id } = useParams()

  console.log(id)



  useEffect(() => {
    console.log(id)

  }, [id])

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
