import { Component } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Cookies from 'js-cookie'
import "./index.css";

class DietDetails extends Component {
  state = {
    dietPlans: [],
    isLoading: false,
    error: null,
    member_email: "",
    goal: "",
    diet_chart: "",
    assigned_by: "", 
    isAdding: false,
  };

  componentDidMount() {
    this.fetchDietPlans();
  }

  fetchDietPlans = async () => {
    this.setState({ isLoading: true, error: null });
    const jwtToken = Cookies.get('jwt_token')

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/diet-plans`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch diet plans");
      }

      const data = await response.json();
      this.setState({ dietPlans: data, isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false, error: error.message });
    }
  };

  handleDelete = async (id) => {
    const jwtToken = Cookies.get('jwt_token')
    try {
      await fetch(`http://localhost:3000/api/admin/diet-plans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      this.fetchDietPlans();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  handleAddDietPlan = async () => {
    const { member_email, goal, diet_chart, assigned_by } = this.state;
    const jwtToken = Cookies.get('jwt_token')

    this.setState({ isAdding: true, error: null });

    try {
      const response = await fetch("http://localhost:3000/api/admin/diet-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          member_email,
          goal,
          diet_chart,
          assigned_by,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add diet plan");
      }

      this.setState({
        member_email: "",
        goal: "",
        diet_chart: "",
        assigned_by: "",
        isAdding: false,
      });
      this.fetchDietPlans();
    } catch (error) {
      this.setState({ isAdding: false, error: error.message });
    }
  };

  render() {
    const {
      dietPlans,
      isLoading,
      error,
      member_email,
      goal,
      diet_chart,
      assigned_by,
      isAdding,
    } = this.state;

    return (
      <div className="bg-container">
        <Header />
        <div className="sidebar-container">
          <Sidebar />
          <div className="dashboard-container">
            <h1 className="dashboard-heading">Diet Plans</h1>

            {/* Add Diet Plan Form */}
            <div className="add-diet-form">
              <h3>Add Diet Plan</h3>
              <input
                type="email"
                placeholder="Member Email"
                value={member_email}
                onChange={(e) => this.setState({ member_email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Goal"
                value={goal}
                onChange={(e) => this.setState({ goal: e.target.value })}
              />
              <textarea
                placeholder="Diet Chart"
                rows={3}
                value={diet_chart}
                onChange={(e) => this.setState({ diet_chart: e.target.value })}
              />
              <input
                type="email"
                placeholder="Assigned By (Admin Email)"
                value={assigned_by}
                onChange={(e) => this.setState({ assigned_by: e.target.value })}
              />
              <button
                className="submit-button"
                onClick={this.handleAddDietPlan}
                disabled={isAdding}
              >
                {isAdding ? "Submitting..." : "Upload Diet Plan"}
              </button>
            </div>

            <hr />

            {/* Display Diet Plans */}
            {isLoading ? (
              <p>Loading diet plans...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : dietPlans.length === 0 ? (
              <p>No diet plans available.</p>
            ) : (
              <ul className="diet-list">
                {dietPlans.map((plan) => (
                  <li key={plan.id} className="diet-item">
                    <p><strong>Member Email:</strong> {plan.member_email}</p>
                    <p><strong>Goal:</strong> {plan.goal}</p>
                    <p><strong>Diet Chart:</strong> {plan.diet_chart}</p>
                    <p><strong>Assigned By:</strong> {plan.admin_email}</p>
                    <p><strong>Created At:</strong> {plan.created_at}</p>
                    <button onClick={() => this.handleDelete(plan.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DietDetails;
