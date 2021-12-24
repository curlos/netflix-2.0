import React, { useState, useEffect } from 'react'

const Plans = () => {
  useEffect(() => {

  }, [])

  return (
    <div className="space-between-y-2">
      <div>Plans (Current Plan: Premium)</div>
      <div className="fs-md">Renewal date: 04/03/2021</div>

      <div className="fs-md space-between-y-4">
        <div className="d-flex justify-content-between ms-4">
          <div>
            <div>Netflix Standard</div>
            <div>1080p</div>
          </div>
          
          <button className="netflixRedButton">Subscribe</button>
        </div>

        <div className="d-flex justify-content-between ms-4">
          <div>
            <div>Netflix Basic</div>
            <div>480p</div>
          </div>
          
          <button className="netflixRedButton">Subscribe</button>
        </div>

        <div className="d-flex justify-content-between ms-4">
          <div>
            <div>Netflix Premium</div>
            <div>4K+HDR</div>
          </div>
          
          <button className="netflixGrayButton">Current Package</button>
        </div>
        
      </div>
    </div>
  )
}

export default Plans
