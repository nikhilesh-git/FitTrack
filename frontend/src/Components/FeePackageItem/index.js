import { Component } from "react";
import Cookies from 'js-cookie'
import "./index.css";

class FeePackageItem extends Component {
  constructor(props) {
    super(props);
    const { packageData } = props;
    this.state = {
      isEditing: false,
      packageInfo: {
        name: packageData.name,
        amount: packageData.amount,
        durationDays: packageData.duration_days,
        description: packageData.description,
        id: packageData.id,
      }
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      packageInfo: {
        ...prevState.packageInfo,
        [name]: name === "amount" || name === "durationDays" ? parseInt(value) : value
      }
    }));
  };

  handleSave = async () => {
    const { packageInfo } = this.state;

    try {
      const jwtToken=Cookies.get('jwt_token')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/packages/${packageInfo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${jwtToken}`
        },
        body: JSON.stringify(packageInfo)
      });

      if (response.ok) {
        this.setState({ isEditing: false });
      } else {
        const errorText = await response.text();
        console.error("Update failed:", errorText);
        alert("Failed to update package: " + errorText);
      }

    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong");
    }
  };

  render() {
    const { isEditing, packageInfo } = this.state;

    return (
      <div className="fee-package-card">
        {isEditing ? (
          <>
            <input
              className="input"
              type="text"
              name="name"
              value={packageInfo.name}
              onChange={this.handleChange}
              placeholder="Package Name"
            />
            <input
              className="input"
              type="number"
              name="amount"
              value={packageInfo.amount}
              onChange={this.handleChange}
              placeholder="Amount"
            />
            <input
              className="input"
              type="number"
              name="durationDays"
              value={packageInfo.durationDays}
              onChange={this.handleChange}
              placeholder="Duration (days)"
            />
            <textarea
              className="input"
              name="description"
              value={packageInfo.description}
              onChange={this.handleChange}
              placeholder="Description"
              rows={3}
            />
            <button className="edit-button" onClick={this.handleSave}>
              Save
            </button>
            <button className="edit-button" onClick={() => this.setState({ isEditing: false })}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h3 className="fee-package-title">{packageInfo.name}</h3>
            <p className="fee-package-detail">
              <strong>Amount:</strong> ₹{packageInfo.amount}
            </p>
            <p className="fee-package-detail">
              <strong>Duration:</strong> {packageInfo.durationDays} days
            </p>
            <p className="fee-package-detail">
              <strong>Description:</strong> {packageInfo.description}
            </p>
            <button className="edit-button" onClick={() => this.setState({ isEditing: true })}>
              Edit
            </button>
          </>
        )}
      </div>
    );
  }
}

export default FeePackageItem;
