import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let intervalId;

        const fetchFiles = async () => {
            try {
                // Get the token from local storage
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('User is not authenticated');
                }

                // Make an API request to fetch user files
                const response = await axios.get('http://localhost:4000/api/file/my-files', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Check if the response is successful
                if (response.status === 200 && response.data.success) {
                    setFiles(response.data.files); // Set files in state
                } else {
                    throw new Error(response.data.message || 'Failed to fetch files');
                }
            } catch (err) {
                console.error(err);
                setError(err.message || 'Error fetching files');
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch when the component mounts
        fetchFiles();

        // Polling: Continuously fetch files every 5 seconds
        intervalId = setInterval(fetchFiles, 5000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run only on component mount

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div >
            <h2>User Files</h2>
            <ul>
                {files.length > 0 ? (
                    files.map(file => (
                        <li key={file._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                            <strong>File Name:</strong> {file.fileName} <br />
                            <strong>File Type:</strong> {file.fileType} <br />
                            <strong>File Size:</strong> {(file.fileSize / 1024).toFixed(2)} KB <br />
                            <strong>File ID:</strong> {file._id} <br />
                            <strong>Upload Date:</strong> {new Date(file.uploadDate).toLocaleString()} <br />
                            <strong>User ID:</strong> {file.user} <br />
                        </li>
                    ))
                ) : (
                    <p>No files uploaded.</p>
                )}
            </ul>
        </div>
    );
};

export default UserFiles;
