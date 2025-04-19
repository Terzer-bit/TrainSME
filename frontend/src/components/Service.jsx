import React, { useState } from 'react';
import './Service.css';
import trashIcon from '../assets/trash-2-neg.svg';
import copyIcon from '../assets/copy.svg'

function Service({ serviceName, fetchServices }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");
    const user_id = localStorage.getItem('user_id');
    const password = localStorage.getItem('password');

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const handleSee = async () => {
        const response = await fetch('http://localhost:5000/api/password-manager/see', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service: serviceName,
                user_id: user_id,
                password: password // master password (used to derive key)
            }),
        });

        const data = await response.json();


        setModalText(data.subkey);
        setShowModal(true);
    };

    const handleGenerate = async () => {
        try {
            // Step 1: Check if the service already exists using the 'exists' route
            const existsResponse = await fetch(`http://localhost:5000/api/password-manager/exists?user_id=${user_id}&service=${encodeURIComponent(serviceName)}`);
            
            if (!existsResponse.ok) {
                const existsErrorData = await existsResponse.json();
                console.error('Error checking if service exists:', existsErrorData);
                return;
            }
    
            const { exists } = await existsResponse.json();
    
            // Step 2: If it exists, delete it
            if (exists) {
                const deleteResponse = await fetch('http://localhost:5000/api/password-manager/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        service: serviceName,
                        user_id: user_id
                    }),
                });
    
                if (!deleteResponse.ok) {
                    const errorData = await deleteResponse.json();
                    console.error('Delete request failed:', errorData);
                    return;
                }
    
                console.log('Previous service deleted successfully.');
            } else {
                console.log('No existing service found. Proceeding to generate.');
            }
    
            // Step 3: Add the new service
            const addResponse = await fetch('http://localhost:5000/api/password-manager/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service: serviceName,
                    user_id: user_id,
                    password: password
                }),
            });
    
            if (!addResponse.ok) {
                const addErrorData = await addResponse.json();
                console.error('Error adding new service:', addErrorData);
                return;
            }
    
            const data = await addResponse.json();
            console.log('Service generated successfully.');
            handleSee();
    
        } catch (err) {
            console.error('Unexpected error in handleGenerate:', err);
        }
    };
    
    const handleDelete = async () => {
        try {
            const deleteResponse = await fetch('http://localhost:5000/api/password-manager/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service: serviceName,
                    user_id: user_id
                }),
            });

            if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json();
                console.error('Delete request failed:', errorData);
                return;
            }

            console.log('Service deleted successfully.');
            fetchServices(); // Re-fetch services after deletion

        } catch (err) {
            console.error('Unexpected error in handleDelete:', err);
        }
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(modalText);
        setShowModal(false)
    };

    return (
        <>
            <div className="service">
                <div className="service-header" onClick={toggleExpand}>
                    <div className="service-logo">
                        <img src="/lock.png" alt="service picture" className="logo" />
                    </div>
                    <span className="service-name">{serviceName}</span>
                    <button className="expand-toggle">{isExpanded ? "▲" : "▼"}</button>
                </div>
                {isExpanded && (
                    <div className="service-actions">
                        <button className="generate-button" onClick={() => handleGenerate()}>
                            Generate Password
                        </button>
                        <button className="see-button" onClick={() => handleSee()}>
                            See Password
                        </button>
                        <button className="delete-button" onClick={() => handleDelete()}>
                            <img src={trashIcon} alt="Delete icon" className="icon" />
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <button className="close-button" onClick={() => setShowModal(false)}>X</button>
                        <div className="modal-text">
                            <p className="modal-password">{modalText}</p>
                        </div>
                        <button className="copy-button" onClick={copyToClipboard}>
                            <img src={copyIcon} alt="Copy icon" className="icon" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Service;
