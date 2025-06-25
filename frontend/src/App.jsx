import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home/Home'
import LoginPopup from './components/LoginPopup/LoginPopup.jsx'
const App = () => {
  const [showLogin,setshowLogin]=useState(false);
  return (
    <div>
    {showLogin?<LoginPopup setshowLogin={setshowLogin}/>:<></>}
    
      <Navbar setshowLogin={setshowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
