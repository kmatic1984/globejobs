import React from 'react';
import './Header.css'; // Assuming CSS file for styling

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>JobPortal</h1> {/* Replace with actual logo component */}
            </div>
            <nav className="nav">
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/jobs">Job Listings</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
            <div className="auth-buttons">
                <button className="sign-in">Sign In</button>
                <button className="post-job">Post a Job</button>
            </div>
        </header>
    );
};

export default Header;