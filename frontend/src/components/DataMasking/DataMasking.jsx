import React from 'react';
import './DataMasking.css';
import { assets } from '../../assets/assets';

const DataMasking = () => {
  return (
    <div className="data-masking-container">
      <div className="data-masking-header">
        <h2>What is Data Masking?</h2>
      </div>
      <div className="data-masking-content">
        <img src={assets.what_is_DM} alt="Data Masking Illustration" className="data-masking-image" />
        <div className="data-masking-text">
          <p>
            <strong>Data Masking</strong> is a method of creating a structurally similar version of the original data but with the essential information obfuscated.
            It ensures sensitive data, such as credit card numbers, phone numbers, and personal addresses, are protected, reducing the risk of breaches.
          </p>
          <p>
            Companies, especially large organizations, use data masking to secure customer data. It is an essential strategy for ensuring privacy and regulatory compliance
            when sharing data internally or with external parties for testing, development, or analysis purposes.
          </p>
          <p>
            Data masking techniques include encryption, character scrambling, and substitution. These techniques help transform sensitive data into a non-readable format,
            protecting against unauthorized access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataMasking;
