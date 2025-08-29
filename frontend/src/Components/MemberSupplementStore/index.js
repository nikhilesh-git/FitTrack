import { Component } from "react";
import Header from "../Header";
import MemberSidebar from "../MemberSidebar";
import Cookies from 'js-cookie';
import "./index.css";

class MemberSupplementStore extends Component {
  state = {
    supplementList: [],
    isLoading: false,
  };

  componentDidMount() {
    this.getSupplements();
  }

  getSupplements = async () => {
    this.setState({ isLoading: true });
    const jwtToken = Cookies.get('jwt_token');
    const apiUrl =`${process.env.REACT_APP_API_URL}/api/admin/supplements/`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET'
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const data = await response.json();
      const updatedData = data.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        stockQuantity: item.stock_quantity,
        url: item.url
      }));
      this.setState({ supplementList: updatedData, isLoading: false });
    } else {
      console.error("Failed to fetch supplements");
      this.setState({ isLoading: false });
    }
  };

  renderSupplements = () => {
    const { supplementList } = this.state;
    return (
      <div className="supplement-cards-wrapper">
        {supplementList.map((item) => (
          <div key={item.id} className="supplement-card">
            <img src={item.url} alt={item.name} className="supplement-image" />
            <h3 className="supplement-name">{item.name}</h3>
            <p className="supplement-description">{item.description}</p>
            <p className="supplement-price">₹ {item.price.toFixed(2)}</p>
            <p className="supplement-stock">In Stock: {item.stockQuantity}</p>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className="bg-container">
        <Header />
        <div className="sidebar-container">
          <MemberSidebar />
          <div className="dashboard-container">
            <h1 className="dashboard-heading">Supplement Store</h1>
            {this.renderSupplements()}
          </div>
        </div>
      </div>
    );
  }
}

export default MemberSupplementStore;
