import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import requests, { API_BASE_URL } from '../requests'
import Row from '../components/Row'

const Home = () => {
  return (
    <div className="bg-black">
      <Navbar />
      <Banner />

      <div className="p-3">
        {Object.values(requests).map((request) => (
          <Row apiUrl={API_BASE_URL + request.url} name={request.name}/>
        ))}
      </div>
    </div>
  )
}

export default Home
