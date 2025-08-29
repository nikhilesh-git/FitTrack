import { Component } from "react"
import Header from "../Header"
import Sidebar from "../Sidebar"
import { ClipLoader } from 'react-spinners';
import SupplementItem from "../SupplementItem"
import Cookies from 'js-cookie'

import "./index.css"

// const supplementList = [
//   {
//     id: 1,
//     name: "Whey Protein",
//     price: 1999.00,
//     description: "High‑quality whey protein to support muscle growth.",
//     stockQuantity: 25,
//     imageUrl: "https://i.ibb.co/7xLgP1db/image.png"
//   },
//   {
//     id: 2,
//     name: "Creatine Monohydrate",
//     price: 899.00,
//     description: "Supports strength and performance during high‑intensity workouts.",
//     stockQuantity: 40,
//     imageUrl: "https://i.ibb.co/G3MHBG7S/image.png"
//   },
//   {
//     id: 3,
//     name: "BCAA",
//     price: 1199.00,
//     description: "Branched‑chain amino acids to reduce muscle soreness.",
//     stockQuantity: 30,
//     imageUrl: "https://i.ibb.co/sdDWXqvy/image.png"
//   },
//   {
//     id: 4,
//     name: "Omega-3 Fish Oil",
//     price: 699.00,
//     description: "Supports heart health and reduces inflammation.",
//     stockQuantity: 50,
//     imageUrl: "https://i.ibb.co/jZJkdBZZ/image.png"
//   },
//   {
//     id: 5,
//     name: "Multivitamin",
//     price: 499.00,
//     description: "Daily essential vitamins and minerals for overall wellness.",
//     stockQuantity: 100,
//     imageUrl: "https://i.ibb.co/4ndHkjKw/image.png"
//   }
// ];



class SupplementStore extends Component{
    state={
        supplementList:[],
        isLoading:false,
        addSupplementState:false,
        newSupplement: {
            name: '',
            price: '',
            description: '',
            stockQuantity: '',
            url: ''
        }
    }

    
    getSupplements= async ()=>{
        this.setState({isLoading:true});
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl=`${process.env.REACT_APP_API_URL}/api/admin/supplements/`;
        const options={
            headers:{
                Authorization: `Bearer ${jwtToken}`,
            },
            method:'GET'
        }
        const response=await fetch(apiUrl,options);
        if(response.ok===true){
            const fecthedData=await response.json();
            console.log(fecthedData)
            const updatedData= fecthedData.map((supplement)=>({
                id:supplement.id, 
                name:supplement.name,
                price:supplement.price,
                description:supplement.description,
                stockQuantity:supplement.stock_quantity,
                url:supplement.url    
            }))
            this.setState({
                supplementList:updatedData,
                isLoading:false
            })
        }
    }

    componentDidMount=()=>{
        this.getSupplements()
    }

    addSupplement=()=>{
        this.setState({addSupplementState:true})
    }
    
    handleAddInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "number" ? Number(value) : value;

    this.setState((prevState) => ({
        newSupplement: {
        ...prevState.newSupplement,
        [name]: newValue,
        },
    }));
    };

    submitNewSupplement = async () => {
    const { newSupplement } = this.state;
    const { name, price, description, stockQuantity, url } = newSupplement;

    if (!name || !price || !description || !stockQuantity || !url) {
        alert("Please fill all the fields");
        return;
    }

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/supplements/`;
    const data = {
        name,
        price: parseFloat(price),
        description,
        stockQuantity: parseInt(stockQuantity, 10),
        url
    };

    const options = {
        headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(apiUrl, options);
        if (response.ok) {
        alert("Supplement added successfully");
        this.setState({
            addSupplementState: false,
            newSupplement: {
            name: '',
            price: '',
            description: '',
            stockQuantity: '',
            url: ''
            }
        });
        this.getSupplements(); // Refresh the list
        } else {
        throw new Error("Failed to add supplement");
        }
    } catch (error) {
        console.error("Error adding supplement:", error);
        alert("Something went wrong!");
    }
    };
  
    renderAddSupplementForm = () => {
    const { newSupplement } = this.state;
    const { name, price, description, stockQuantity, url } = newSupplement;

    return (
        <div className="add-supplement-form">
        <h2>Add New Supplement</h2>

        <div className="input-container">
            <label htmlFor="name" className="label">Name</label><br />
            <input
            className="input"
            type="text"
            name="name"
            value={name}
            onChange={this.handleAddInputChange}
            placeholder="Supplement Name"
            />
        </div>

        <div className="input-container">
            <label htmlFor="description" className="label">Description</label><br />
            <textarea
            className="input"
            name="description"
            value={description}
            onChange={this.handleAddInputChange}
            rows={3}
            placeholder="Description"
            />
        </div>

        <div className="input-container">
            <label htmlFor="price" className="label">Price</label><br />
            <input
            className="input"
            type="number"
            name="price"
            value={price}
            onChange={this.handleAddInputChange}
            placeholder="Price"
            />
        </div>

        <div className="input-container">
            <label htmlFor="stockQuantity" className="label">Stock</label><br />
            <input
            className="input"
            type="number"
            name="stockQuantity"
            value={stockQuantity}
            onChange={this.handleAddInputChange}
            placeholder="Stock Quantity"
            />
        </div>

        <div className="input-container">
            <label htmlFor="url" className="label">Image URL</label><br />
            <input
            className="input"
            type="text"
            name="url"
            value={url}
            onChange={this.handleAddInputChange}
            placeholder="Image URL"
            />
        </div>

        <div className="buttons-container">
            <button className="edit-button" onClick={this.submitNewSupplement}>
            Add
            </button>
            <button
            className="edit-button cancel-button"
            onClick={() => this.setState({ addSupplementState: false })}
            >
            Cancel
            </button>
        </div>
        </div>
    );
    };


    renderSupplements=()=>{
        const {supplementList,addSupplementState}=this.state;

        return (
            <div className="bg-container">
            <Header/>
            <div className="sidebar-container">
                <Sidebar/>
                <div className="dashboard-container">
                    <div className="heading-container">
                        <h1 className="dashboard-heading">Supplements</h1>
                        {
                            addSupplementState?null:<button type="button" className="add-supplement-button" onClick={this.addSupplement}>Add Supplement</button>
                        }
                    </div>
                    <div className="supplements-container">
                        <div className="supplements-items-container">
                            {
                                !addSupplementState?(
                                    supplementList.map((supplementDetails)=>(
                                        <SupplementItem key={supplementDetails.id} supplementDetails={supplementDetails} getSupplements={this.getSupplements}/>
                                    ))
                                ):(
                                    this.renderAddSupplementForm()
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
        

    renderLoader = () => (
        <div className="notifications-loader-container">
            <ClipLoader color="#1a305b" size={50} />
        </div>
    )
    render(){
        const {isLoading}=this.state;
        return (
            isLoading?this.renderLoader():this.renderSupplements()
        )    
    }
}
    

export default SupplementStore;