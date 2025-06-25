import React, { useState } from 'react';
import './FAQs.css'; // Import your CSS file

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const accordionData = [
        { question: "What types of files can I upload for PII detection and masking?", answer: "Our application supports a wide range of file formats for PII detection and masking. You can upload common document formats such as DOCX, PDF, XLSX, and TXT. Additionally, we also support image formats including JPEG, PNG, and BMP. This versatility ensures that you can process various types of documents and images to protect sensitive information effectively." },
        { question: "Is the application free to use, or are there any paid features?", answer: "The core features of our PII detection and masking application are entirely free to use. This includes the ability to detect and mask a broad range of personally identifiable information (PII) across various document formats. We are committed to providing these essential services at no cost, although there may be optional premium features or services available in the future that offer additional functionality or advanced capabilities." },
        { question: "How does the application ensure my data remains secure?", answer: " We prioritize your data's security throughout the entire process. All documents are encrypted during transfer using secure protocols, and encryption continues during processing and storage to ensure that your data is fully protected. We adhere to industry best practices and standards to safeguard your information against unauthorized access and breaches, giving you peace of mind while using our application." },
        { question: "Can I use the application on any device?", answer: "Yes, our application is designed to be accessible from any device with an internet connection. Whether you are using a mobile phone, tablet, or desktop computer, you can access and utilize our PII detection and masking services seamlessly. This cross-device compatibility ensures that you can manage and protect your sensitive information from virtually anywhere." },
        { question: "What kinds of PII does the application detect?", answer: "Our application is equipped to detect a comprehensive range of personally identifiable information (PII). This includes, but is not limited to, names, addresses, phone numbers, email addresses, credit card details, social security numbers, and other sensitive data. Our advanced detection algorithms and regex patterns help ensure that various types of PII are identified and masked to maintain your privacy and security." },

    ];

    return (
        <div className='FAQS' id='FAQs'>
            <div className="title">
                <p>FAQS</p>
            </div>
            <div className="faq-container">
                {accordionData.map((item, index) => (
                    <div className="question" key={index}>
                        <div className="question-header" onClick={() => toggleAccordion(index)}>
                            <h2 className="question-name">{item.question}</h2>
                            <button className="arrow-button">{openIndex === index ? '▲' : '▼'}</button>
                        </div>
                        {openIndex === index && (
                            <div className="question-content">
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQs;
