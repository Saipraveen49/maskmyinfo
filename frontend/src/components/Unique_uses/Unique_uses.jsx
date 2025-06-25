import React from 'react';
import './Unique_uses.css';
import { assets } from '../../assets/assets.js';

const Unique_uses = () => {
  const overview_data = [
    { image: assets.multiple_files, title: "Mask Multiple File Types", matter: "Works with various file formats like DOCX, PDF, XLSX, and TXT." },
    { image: assets.quickMasking, title: "Fast Masking Operations", matter: "Quickly detects and hides personal information with just a few clicks." },
    { image: assets.SimpleToUse, title: "Simple to Use", matter: "Easy design that doesn't require special training.Drag-and-drop to easily upload documents." },
    { image: assets.customizable, title: "Customizable Masking Options", matter: "Choose which personal information you want to hide or remove." },
    { image: assets.DataSecurity, title: " Secure Encryption", matter: "Protects your documents with encryption during upload, processing, and storage." },
    { image: assets.multiple_lang, title: "Supports Multiple Languages", matter: "•	Detects and masks personal information in many languages." },
    {image:assets.realTimeAlertsUpdates,title:"Real-Time Alerts and Updates",matter:"•	Immediately notifies you when sensitive information is found."}
  ];

  return (
    <div id='overview'>
      <div className="overview">
        <div className="overview-title">
          <p>OVERVIEW</p>
        </div>
        <div className="overview-container">
          {overview_data.map((item, index) => (
            <div className="single-container" key={index}>
              <img src={item.image} alt={item.title} />
              <h5>{item.title}</h5>
              <p>{item.matter}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Unique_uses;
