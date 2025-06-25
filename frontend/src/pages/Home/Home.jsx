import React from 'react'
import Header from '../../components/Header/Header'
import DataMasking from '../../components/DataMasking/DataMasking'
import UploadSection from '../../components/UploadSection/UploadSection'
import FAQs from '../../components/FAQs/FAQs'
import Unique_uses from '../../components/Unique_uses/Unique_uses'
import UserFiles from '../../components/UserFiles/UserFiles'
import ScrollToTop from '../../components/scrollToTop/ScrollToTop'

const Home = () => {
  return (
    <div>
      <Header/>
      <Unique_uses/>
      <DataMasking/>
      <UploadSection/>
      <ScrollToTop/>
      <FAQs/>
    </div>
  )
}

export default Home
