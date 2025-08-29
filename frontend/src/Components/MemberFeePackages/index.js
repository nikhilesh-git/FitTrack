import { Component } from "react";
import Header from "../Header";
import MemberSidebar from "../MemberSidebar";
import Cookies from "js-cookie";
import { FaRupeeSign, FaClock, FaFileAlt } from "react-icons/fa";
import "./index.css";

class MemberFeePackages extends Component {
  state = {
    packages: [],
    isLoading: true,
  };

  componentDidMount() {
    this.fetchPackages();
  }

  fetchPackages = async () => {
    try {
      const apiUrl =`${process.env.REACT_APP_API_URL}/api/admin/packages/`;
      const jwtToken = Cookies.get("jwt_token");
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: "GET",
      };
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        this.setState({ packages: data, isLoading: false });
      } else {
        console.error("Failed to fetch packages");
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Error:", error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { packages, isLoading } = this.state;

    return (
      <div className="member-bg-container">
        <Header />
        <div className="sidebar-container">
          <MemberSidebar />
          <div className="dashboard-container">
            <h1 className="dashboard-heading">Available Fee Packages</h1>
            <div className="packages-list">
              {isLoading ? (
                <p className="loading-text">Loading packages...</p>
              ) : packages.length === 0 ? (
                <p className="no-packages">No packages available</p>
              ) : (
                packages.map((pkg) => (
                  <div className="member-package-card" key={pkg.id}>
                    <h2 className="package-title">{pkg.name}</h2>
                    <p className="package-description">
                      <FaFileAlt className="icon" /> {pkg.description}
                    </p>
                    <p className="package-duration">
                      <FaClock className="icon" /> Duration:{" "}
                      <span>{pkg.duration_days} Days</span>
                    </p>
                    <p className="package-price">
                      <FaRupeeSign className="icon" /> Price: ₹
                      <span>{pkg.amount}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MemberFeePackages;
