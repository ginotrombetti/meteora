import React, { FC } from 'react';


interface NavHeaderProps {}

const NavHeader: FC<NavHeaderProps> = () => (
    <div className="w3-top">
        <div className="w3-bar w3-white w3-card" id="myNavbar">
            <a href="#home" className="w3-bar-item w3-button w3-wide">HOME</a>
            <div className="w3-right w3-hide-small">
                <a href="#about" className="w3-bar-item w3-button">ABOUT</a>
            </div>
            <a className="w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium">
                <i className="fa fa-bars"></i>
            </a>
        </div>
    </div>
);

export default NavHeader;
