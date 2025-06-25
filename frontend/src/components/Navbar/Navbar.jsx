import React, { useState } from 'react'
import './Navbar.css'
import {Link,useNavigate} from 'react-router-dom'
import { assets } from '../../assets/assets'

const Navbar = ({setshowLogin}) => {
    const [menu,setMenu]=useState("home")
    const navigate = useNavigate(); // Use this hook for navigation
    const token = localStorage.getItem("token"); // Retrieve token from local storage

    const logout = () => {
        localStorage.removeItem("token"); // Remove token from local storage
        setMenu("home"); // Optionally reset menu state on logout
        navigate("/"); // Navigate to home page
    };

  return (
    <div id='navbar'>
      <div className="navbar">
      <div className="navbar-left">
        <Link to='/'><img src={assets.logo} alt="" className='logo'/></Link>
        <h2>MaskMyInfo</h2>
      </div>
        
        <div className="navbar-items">
            <ul>
                <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?'active-nav':""}>Home</Link>
                <a href="https://sensitivity-detecto.web.app/" onClick={()=>setMenu("demo")} className={menu==="demo"?'active-nav':""}>Demo</a>
                <a href="#upload-section" onClick={()=>setMenu("benifits")} className={menu==="benifits"?'active-nav':""}>Protect</a>
                <a href="#FAQs" onClick={()=>setMenu("faq")} className={menu==="faq"?'active-nav':""}>FAQs</a>
                <a href="#footer" onClick={()=>setMenu("extra")} className={menu==="extra"?'active-nav':""}>About Us</a> 
            </ul>
        </div>
        <div className="navbar-right">
        {!token?<button onClick={()=>{setshowLogin(true)}}>sign in</button>:
              <div className='navbar-profile'>
                <img src={assets.profile_icon} alt="" />
                
                <ul className='nav-profile-dropdown'>
                  <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            
                </ul>
              </div>}
        </div>
      </div>
    </div>
  )
}

export default Navbar