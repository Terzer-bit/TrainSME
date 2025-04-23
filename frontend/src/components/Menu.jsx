import React, { useState, useEffect } from 'react';
import './Menu.css';
import { useNavigate, useLocation } from 'react-router-dom';
import pfp from '../assets/blank-profile.svg';
import logoutIcon from '../assets/log-out-neg.svg';
import metricsIcon from '../assets/list-neg.svg';
import passwordManagaerIcon from '../assets/book-lock-neg.svg';
import phishingTestIcon from '../assets/circle-plus-neg.svg';
import enterpriseIcon from '../assets/chart-neg.svg';


function Menu() {
    const [activeItem, setActiveItem] = useState(null); // keep track of the items
    const navigate = useNavigate();
    const location = useLocation(); // use location to detect how the state should change
    const [userInfo, setUserInfo] = useState({
        user_id: '',
        username: '',
        email: '',
        admin: ''
      });

    useEffect(() => {
        const user_id = localStorage.getItem('user_id');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const admin = localStorage.getItem('admin');
        if (username && email) {
          setUserInfo({ user_id, username, email, admin });
        }
      }, []);
      

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);

        if (itemName === 'Phishing simulator') {
            navigate('/home');
        } else if (itemName === 'Password manager') {
            navigate('/password-manager');
        } else if (itemName === 'My results') {
            navigate('/metrics');
        } else if (itemName === 'Enterprise metrics') {
            navigate('/enterprise-metrics');
        } else if (itemName === 'Sign Out') {
            // Handle sign out logic here (e.g., clear token, redirect to login)
            console.log('Sign Out clicked');
            navigate('/login');
        }
    };

    // Determine active item based on path
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('phishing-test') || path.includes('home')) {
            setActiveItem('Phishing simulator');
        } else if (path.includes('password-manager')) {
            setActiveItem('Password manager');
        } else if (path.includes('enterprise-metrics')){
            setActiveItem('Enterprise metrics');
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
                    <div className="username">{userInfo.username}</div>
                    <div className="email">{userInfo.email}</div>
                </div>
            </div>

            <ul className="menu-items">
                <li
                    className={`menu-item ${activeItem === 'Phishing simulator' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Phishing simulator')}
                >
                    <img src={phishingTestIcon} alt="Phishing simulator icon" className="icon" />
                    Phishing simulator
                </li>
                <li
                    className={`menu-item ${activeItem === 'Password manager' ? 'active' : ''}`}
                    onClick={() => handleItemClick('Password manager')}
                >
                    <img src={passwordManagaerIcon} alt="Password manager icon" className="icon" />
                    Password manager
                </li>
                <li
                    className={`menu-item ${activeItem === 'My results' ? 'active' : ''}`}
                    onClick={() => handleItemClick('My results')}
                >
                    <img src={metricsIcon} alt="Metrics icon" className="icon" />
                    My results
                </li>

                {userInfo.admin === 'true' && (
                    <li
                        className={`menu-item ${activeItem === 'Enterprise metrics' ? 'active' : ''}`}
                        onClick={() => handleItemClick('Enterprise metrics')}
                    >
                        <img src={enterpriseIcon} alt="Enterprise metrics icon" className="icon" />
                        Enterprise metrics
                    </li>
                )}
            </ul>


            <button className="sign-out-button" onClick={() => handleItemClick('Sign Out')}>
                <span>Sign Out</span> <span><img src={logoutIcon} alt="Log out icon" className="log-out-icon" /></span>
            </button>


        </div>
    );
}

export default Menu;