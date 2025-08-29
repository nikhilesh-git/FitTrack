import { Component } from "react";
import Cookies from "js-cookie";
import  jwtDecode  from "jwt-decode";
import Header from "../Header";
import MemberSidebar from "../MemberSidebar";
import "./index.css";

class MemberDietDetails extends Component {
  state = {
    dietPlan: null,
    isLoading: false,
    error: null,
  };

  componentDidMount() {
    this.fetchMemberDietPlan();
  }

  fetchMemberDietPlan = async () => {
    this.setState({ isLoading: true, error: null });

    const jwtToken = Cookies.get("jwt_token");
    if (!jwtToken) {
      this.setState({ error: "Token not found", isLoading: false });
      return;
    }

    try {
      const decoded = jwtDecode(jwtToken);
      const memberId = decoded.id; // 👈 assuming "id" holds member's ID

      const dietRes = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/diet-plans/${memberId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!dietRes.ok) {
        const errorText = await dietRes.text();
        throw new Error(errorText || "Failed to fetch diet plan");
      }

      const plan = await dietRes.json();
      this.setState({ dietPlan: plan, isLoading: false });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  };

  render() {
    const { dietPlan, isLoading, error } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="sidebar-container">
          <MemberSidebar />
          <div className="dashboard-container">
            <h1 className="dashboard-heading">My Diet Plan</h1>

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : !dietPlan ? (
              <p>No diet plan found.</p>
            ) : (
              <div className="diet-item">
                <p><strong>Goal:</strong> {dietPlan.goal}</p>
                <p><strong>Diet Chart:</strong> {dietPlan.diet_chart}</p>
                <p><strong>Assigned By (Admin ID):</strong> {dietPlan.assigned_by}</p>
                <p><strong>Created At:</strong> {dietPlan.created_at}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MemberDietDetails;
