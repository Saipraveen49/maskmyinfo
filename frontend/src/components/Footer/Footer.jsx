import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'
const Footer = () => {
  return (

    <div className="footer" id='footer'>
      <div className="footer-main">
        <div className="footer-left">
          <img src={assets.logo} alt="" />
          
        </div>
        <div className="footer-center">
          <h2>COMPANY</h2>
          <ul>
            <a href="#navbar"><li>Home</li></a>
            <a href="#overview"><li>Overview</li></a>
            <a href="#upload-section"><li>Upload</li></a>
            <a href=""><li>Privacy policy</li></a>
          </ul>
        </div>
        <div className="footer-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 9999999999</li>
            <li>maskmyinfo@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 MaskMyInfo.com - All Right Reserved.
      </p>
      
    </div>

  )
}

export default Footer
