import { Component } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import FeePackageItem from "../FeePackageItem";
import Cookies from 'js-cookie'
import "./index.css";

class FeePackages extends Component {
  state = {
    packages: [],
    isLoading: true,
  };

  componentDidMount() {
    this.fetchPackages();
  }

  fetchPackages = async () => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/packages/`;
      const jwtToken = Cookies.get('jwt_token')
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: "GET",
      };
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const data = await response.json();
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

  handleUpdate = (updatedPackage) => {
    this.setState((prevState) => ({
      packages: prevState.packages.map((pkg) =>
        pkg.id === updatedPackage.id ? updatedPackage : pkg
      ),
    }));
  };

  render() {
    const { packages, isLoading } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="sidebar-container">
          <Sidebar />
          <div className="dashboard-container">
            <h1 className="dashboard-heading">Fee Packages</h1>
            <div className="packages-list">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                packages.map((item) => (
                  <FeePackageItem
                    key={item.id}
                    packageData={item}
                    onUpdate={this.handleUpdate}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeePackages;
