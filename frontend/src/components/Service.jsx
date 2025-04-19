import React, { useState } from 'react';
import './Service.css';
import trashIcon from '../assets/trash-2-neg.svg';
import copyIcon from '../assets/copy.svg'

function Service({ serviceName = "Google" }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");

    const toggleExpand = () => setIsExpanded(prev => !prev);

    const handleModal = (text) => {
        setModalText(text);
        setShowModal(true);
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
                        <img src="/google.jpg" alt="service picture" className="logo" />
                    </div>
                    <span className="service-name">{serviceName}</span>
                    <button className="expand-toggle">{isExpanded ? "▲" : "▼"}</button>
                </div>
                {isExpanded && (
                    <div className="service-actions">
                        <button className="generate-button" onClick={() => handleModal("q9f8S!v#2")}>
                            Generate Password
                        </button>
                        <button className="see-button" onClick={() => handleModal("hunter2")}>
                            See Password
                        </button>
                        <button className="delete-button">
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
