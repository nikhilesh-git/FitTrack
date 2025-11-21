import { Component } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import Cookies from "js-cookie"
import Header from "../Header";
import { Link } from "react-router-dom";
import "./index.css"

class Profile extends Component {
    state={
        name:"",
        email:"",
        phone:"",
        joined_at:"",
        role:"member"

    }
    componentDidMount(){
        this.getDetails();
    }

    getDetails = async () => {
    try {
        const jwtToken = Cookies.get('jwt_token');
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/profile`;
        const options = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
        };

        const response = await fetch(apiUrl, options);

        if (response.ok===false) {
        // Log error details before parsing
        console.error("Fetch failed:", response.status, response.statusText);
        const text = await response.text();  // read the raw HTML or message
        console.error("Server response:", text);
        return;
        }

        const data = await response.json();
        console.log(data)
        this.setState({name:data.name,email:data.email,phone:data.phone,role:data.role===undefined?"member":data.role,joined_at:data.created_at})
    } catch (err) {
        console.error("Error fetching profile:", err);
    }
    };




    render() {
        const {name,email,role,joined_at,phone}=this.state;
        return (
            <div className="bg-container">
                <Header />
                <div className="profile-bg-container">
                    <div className="back-button-container">
                        <Link to="/dashboard"><button className="back-button">Back</button></Link>
                    </div>
                    <div className="profile-card-container">
                        <div className="icon-name-edit-container">
                            <div className="icon-name-container">
                                <div className="profile-container">
                                    <div className="profile-icon-container"><FaUserCircle className="profile-icon1"/></div>
                                </div>
                                <div className="profile-name-container">
                                    <p className="profile-name">{name}</p>
                                    <p className="profile-email">{email}</p>
                                </div>
                            </div>
                            <div>
                                <button className="edit-icon-button"><FaEdit className="edit-icon"/></button>
                            </div>
                        </div>
                        <div>
                            <p className="profile-heading">Phone</p>
                            <p className="profile-para">{phone}</p>

                            <p className="profile-heading">Role</p>
                            <p className="profile-para">{role}</p>

                            <p className="profile-heading">Joined At</p>
                            <p className="profile-para">{joined_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}


export default Profile;