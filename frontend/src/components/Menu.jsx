import React, { useState } from 'react';
import './Menu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import pfp from '../assets/blank-profile.svg';
import logoutIcon from '../assets/log-out-neg.svg';
import metricsIcon from '../assets/list-neg.svg';
import passwordManagaerIcon from '../assets/book-lock-neg.svg';
import phishingTestIcon from '../assets/circle-plus-neg.svg';


function Menu() {
    const [activeItem, setActiveItem] = useState(null); // keep track of the items
    const navigate = useNavigate();
    const location = useLocation(); // use location to detect how the state should change

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);

        if (itemName === 'Phishing simulator') {
            navigate('/home');
        } else if (itemName === 'Password manager') {
            navigate('/password-manager');
        } else if (itemName === 'My results') {
            navigate('/metrics');
        } else if (itemName === 'Sign Out') {
            // Handle sign out logic here (e.g., clear token, redirect to login)
            console.log('Sign Out clicked');
            navigate('/login');
        }
    };

    // Determine active item based on path
    React.useEffect(() => {
        const path = location.pathname;
        if (path.includes('phishing-test') || path.includes('home')) {
            setActiveItem('Phishing simulator');
        } else if (path.includes('password-manager')) {
            setActiveItem('Password manager');
        } else if (path.includes('metrics')) {
            setActiveItem('My results');
        } else {
            setActiveItem('Phishing simulator'); // Or set a default active item if needed
        }
    }, [location.pathname]);


    return (
        <div className="menu">
            <div className="user-profile">
                <div className="user-avatar">
                    <img src={pfp} alt="Profile picture" className="logo" />
                </div>
                <div className="user-info">
                    <div className="username">Username</div> {/* use localstorage to pass user info*/}
                    <div className="email">example@email.com</div>
                </div>
            </div>

            <ul className="menu-items">
                <li
                    className={`menu-item ${activeItem === 'Phishing simulator' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Phishing simulator')}
                >
                    <img src={phishingTestIcon} alt="Log out icon" className="icon" />
                    Phishing simulator
                </li>
                <li
                    className={`menu-item ${activeItem === 'Password manager' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Password manager')}
                >
                    <img src={passwordManagaerIcon} alt="Log out icon" className="icon" />
                    Password manager
                </li>
                <li
                    className={`menu-item ${activeItem === 'My results' ? 'active' : ''}`}
                    onClick={() => handleItemClick('My results')}
                >
                    <img src={metricsIcon} alt="Log out icon" className="icon" />
                    My results
                </li>
            </ul>

            <button className="sign-out-button" onClick={() => handleItemClick('Sign Out')}>
                <span>Sign Out</span> <span><img src={logoutIcon} alt="Log out icon" className="log-out-icon" /></span>
            </button>


        </div>
    );
}

export default Menu;