import { FaUserCircle } from 'react-icons/fa'
import { Component } from 'react';
import { Link } from "react-router-dom";
import './index.css'
class Header extends Component{

    
  render(){
    return(
      <nav className="nav-header">
        <div className="nav-content">
          <img
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            alt="website logo"
          />
        </div>
        <div className="profile-icon-container">
          <Link to="/profile"><FaUserCircle className="profile-icon" /></Link>
        </div>
      </nav>
    )
  }
}


export default Header
