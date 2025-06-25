import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './UploadSection.css';

const UploadSection = () => {
    const dropAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [files, setFiles] = useState([]);
    const [recognizedText, setRecognizedText] = useState(''); // State to hold recognized text
    const [sensitiveData, setSensitiveData] = useState([]); // Detected sensitive data
    const [selectedLabels, setSelectedLabels] = useState(new Set());

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/file/my-files', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFiles(response.data.files); // Update the file list
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    // Fetch files initially and set up polling
    useEffect(() => {
        fetchFiles();
        const intervalId = setInterval(() => {
            fetchFiles(); // Periodically fetch files to update the list
        }, 1000);
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    const handleDragOver = (event) => {
        event.preventDefault();
        dropAreaRef.current.style.backgroundColor = '#e6e9f0';
    };

    const handleDragLeave = () => {
        dropAreaRef.current.style.backgroundColor = '#f3f4f6';
    };

    const handleDrop = (event) => {
        event.preventDefault();
        dropAreaRef.current.style.backgroundColor = '#f3f4f6';
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
        }
    };

    const handleFileInputChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setFileName(files[0].name);
            setSelectedFile(files[0]);
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                await axios.post('http://localhost:4000/api/file/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                alert('File uploaded successfully');
                setFileName(''); // Clear selected file name
                setSelectedFile(null); // Clear selected file
                fetchFiles(); // Refresh the file list
            } catch (error) {
                console.error('Error uploading file:', error.response?.data || error.message);
                alert('Error uploading file');
            }
        } else {
            alert('No file selected');
        }
    };

    const handleDownload = async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/file/download/${fileId}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'downloaded_file';

                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                } else {
                    const fileExtension = response.data.type.split('/').pop();
                    fileName = `downloaded_file.${fileExtension}`;
                }

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                console.error('Unexpected response status:', response.status);
                alert('Error downloading file: Unexpected response status');
            }
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            alert('Error downloading file: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDelete = async (fileId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/file/delete/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            alert('File deleted successfully');
            setFiles(response.data.files); // Update the file list directly with the response
    
        } catch (error) {
            console.error('Error deleting file:', error.response?.data || error.message);
            alert('Error deleting file');
        }
    };

    // Function to recognize text and detect sensitive data
    const handleRecognizeText = async (fileId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/file/recognize-text/${fileId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.status === 200) {
                setSensitiveData(response.data.sensitiveData);
                alert('Sensitive data recognized successfully');
            } else {
                alert('Error recognizing text');
            }
        } catch (error) {
            console.error('Error recognizing text:', error.response?.data || error.message);
            alert(`Error recognizing text: ${error.response?.data?.message || error.message}`);
        }
    };
    
    
    

    // Toggle selection of labels
    const toggleLabelSelection = (label) => {
        setSelectedLabels((prev) => {
            const updated = new Set(prev);
            if (updated.has(label)) {
                updated.delete(label);
            } else {
                updated.add(label);
            }
            return updated;
        });
    };

    // Handle masking selected data
    const handleMaskText = async (fileId) => {
        try {
            const response = await axios.post(`http://localhost:4000/api/file/recognize-text/${fileId}`, {
                selectedLabels: Array.from(selectedLabels)  // Send selected labels to backend
            }, {
                responseType: 'blob',  // Expect binary file in response
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            // Download the masked file
            const fileName = 'masked_file.pdf';
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error masking data:', error.response?.data || error.message);
            alert('Error applying mask');
        }
    };
    
    
    
    

    return (
        <div id='upload-section'>
            <div className="upload-section">
                <div className="title">
                    <h2>Mask Your Various Documents</h2>
                    <p>Mask document-Online for FREE</p>
                </div>
                <div
                    className="upload-area"
                    ref={dropAreaRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="file-upload"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="upload-button"
                        onClick={() => fileInputRef.current.click()}
                    >
                        Upload File
                    </label>
                    <div className="drop-area" onClick={() => fileInputRef.current.click()}>
                        <p>{fileName ? `Selected file: ${fileName}` : 'Drag & drop files here or click to upload'}</p>
                    </div>
                    <button className='submitButton' onClick={handleUpload}>Submit</button>
                </div>
            </div>

            <div className="file-list">
                <h2>File Repository</h2>
                <ul>
                    {files.map(file => (
                        <li key={file._id}>
                            <div className="name">
                                {file.fileName}
                            </div>
                            <div className="buttons">
                                <button className='download' onClick={() => handleDownload(file._id)}>Download Masked</button>
                                <button className='recognize' onClick={() => handleRecognizeText(file._id)}>Customize Text</button>
                                <button className='delete' onClick={() => handleDelete(file._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {files.length > 0 && sensitiveData.length > 0 && (
    <div className="sensitive-data-selection">
        <h3>Select Data to Mask:</h3>
        <ul>
            {sensitiveData.map((text, index) => (
                <li key={index}>
                    <input
                        type="checkbox"
                        id={`sensitive-data-${index}`}
                        checked={selectedLabels.has(text)}
                        onChange={() => toggleLabelSelection(text)}
                    />
                    <label htmlFor={`sensitive-data-${index}`}>{text}</label>
                </li>
            ))}
        </ul>
        <button onClick={() => handleMaskText(files.find(file => file.fileName === fileName)._id)}>
            Apply Masking
        </button>
    </div>
)}



        </div>
    );
};

export default UploadSection;
