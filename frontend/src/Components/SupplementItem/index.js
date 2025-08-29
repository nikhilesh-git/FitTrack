import { Component } from "react";
import "./index.css";
import Cookies from 'js-cookie'
import { FaEdit, FaTrash } from "react-icons/fa";

class SupplementItem extends Component{
    constructor(props) {
    super(props);
    const { supplementDetails} = props;
    this.state = {
      isEditing: false,
      supplementInfo: {
        name: supplementDetails.name,
        price: supplementDetails.price,
        description: supplementDetails.description,
        stockQuantity: supplementDetails.stockQuantity,
        id: supplementDetails.id,
        url:supplementDetails.url
      }
    };
    console.log(this.state);
    }

    

    handleChange = (event) => {
    const { name, value, type } = event.target;

    // For number inputs, convert to number
    const newValue = type === 'number' ? Number(value) : value;

    this.setState((prevState) => ({
        supplementInfo: {
        ...prevState.supplementInfo,
        [name === 'stock' ? 'stockQuantity' : name]: newValue,
        },
    }));
    };


    handleDelete = async () => {
        const {supplementInfo}=this.state;
        const {id}=supplementInfo; 
        const { getSupplements } = this.props;
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl=`http://localhost:3000/api/admin/supplements/${id}`;
        const options={
            headers:{
                Authorization: `Bearer ${jwtToken}`
            },
            method:'DELETE'
        }
        const response = await fetch(apiUrl,options);
        if(response.ok===true){
            if (typeof getSupplements === "function") {
                getSupplements();
            }
        }
        else{
        throw new Error('Something went wrong!');
        }
    };

    handleSave= async ()=>{
        const {supplementInfo}=this.state;
        const {name,price,url,description,stockQuantity,id}=supplementInfo;
        if(name==='' || price==='' || description==='' || url==='' || stockQuantity===''){
            alert("Please Enter all the details");
        }
        else{
            const jwtToken=Cookies.get('jwt_token')
            const apiUrl=`${process.env.REACT_APP_API_URL}/api/admin/supplements/${id}`;
            const data={
            name:name,
            price:parseFloat(price,10),
            description:description,
            stockQuantity:parseInt(stockQuantity,10),
            url:url
            }

            const options={
            headers:{
                Authorization:`Bearer ${jwtToken}`,
                'Content-Type':'Application/json'
            },
            method: 'PUT',
            body:  JSON.stringify(data)      
            }  
            const response = await fetch(apiUrl,options);
            if(response.ok===true){
            this.setState({
                isEditing:false
            })
            }
            else{
            throw new Error('Something went wrong!');
            }
        }
    }

    render(){
        const {supplementInfo,isEditing}=this.state;
        const {name,description,price,stockQuantity,url}=supplementInfo;
        
        return (
        <div className={isEditing?"supplement-card-editing supplement-card":"supplement-card"}>
            {
                !isEditing?(
                    
                  <>  
                    <img className="supplement-image" alt={name} src={url} />
                    <div className="supplement-content">
                        <h2 className="supplement-name">{name}</h2>
                        <p className="supplement-description">{description}</p>
                        <p className="supplement-price">Price: ₹{price}</p>
                        <p className="supplement-stock">Stock: {stockQuantity}</p>
                        <div className="supplement-actions">
                            <button className="action-btn edit-btn" onClick={()=> this.setState({isEditing:true})}>
                                <FaEdit /> Edit
                            </button>
                            <button className="action-btn delete-btn" onClick={this.handleDelete}>
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                  </>  
                ):(
                    <>
                      <div className="input-container">
                        <label htmlFor="name" className="label">Name</label>
                        <br/>
                        <input
                        className="input"
                        type="text"
                        name="name"
                        id='name'
                        value={name}
                        onChange={this.handleChange}
                        placeholder="Package Name"
                        />
                      </div>
                        
                      <div className="input-container">
                        <label htmlFor="description" className="label">Description</label>
                        <br/>    
                        <textarea
                        id="description"
                        className="input"
                        name="description"
                        value={description}
                        onChange={this.handleChange}
                        placeholder="Description"
                        rows={3}
                        />
                      </div>  
                        
                      <div className="input-container">
                        <label htmlFor="price" className="label">Price</label>
                        <br/>
                        <input
                        className="input"
                        type="number"
                        name="price"
                        id="price"
                        value={price}
                        onChange={this.handleChange}
                        placeholder="Price"
                        />
                      </div>  
                        
                      <div className="input-container">
                        <label htmlFor="stock" className="label">Stock</label>
                        <br/>
                        <input
                        className="input"
                        type="number"
                        name="stock"
                        id="stock"
                        value={stockQuantity}
                        onChange={this.handleChange}
                        placeholder="Stock"
                        />
                      </div>  

                        
                      <div className="input-container">
                        <label htmlFor="url" className="label">Image Url</label>
                        <br/>
                        <input
                        className="input"
                        type="text"
                        name="url"
                        id='url'
                        value={url}
                        onChange={this.handleChange}
                        placeholder="Image Url  "
                        />
                      </div>  
                        
                      <div className="buttons-container">
                        <button className="edit-button" onClick={this.handleSave}>
                        Save
                        </button>
                        <button className="edit-button cancel-button" onClick={() => this.setState({ isEditing: false })}>
                        Cancel
                        </button>
                      </div>  
                    </>
                )
            }
        </div>
      );
  };
}
    


export default SupplementItem;
