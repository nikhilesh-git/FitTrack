import { Component } from "react"
import Header from "../Header";
import Sidebar from "../Sidebar";
import Cookies from 'js-cookie'
import { ClipLoader } from 'react-spinners';

import "./index.css"

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
  billPosted:"BILL_POSTED"
};

const errorMessageConstants={
  required:"*Required",
  invalidEmail:"*Invalid Email"
}


class CreateBills extends Component{
  state={
    email:'',
    isEmailPresent:true,
    errorMessage:errorMessageConstants.required,
    status:apiStatusConstants.initial,
    name:'',
    packageType:'',
    isNamePresent:true,
    amountPaid:'',
    isAmountPresent:true ,
    paymentMethod:'UPI',
    member_id:null
  }

  
  nameInput = () => {
    const {isNamePresent,name} = this.state

    return (
      <div className="input-container">
        <label className="label" htmlFor="name">
          Name
        </label>
        <br />
        <input
          readOnly
          className="input"
          id="name"
          type="text"
          value={name}
          placeholder="Name"
        />
        {!isNamePresent && <p className="required">*Required</p>}
      </div>
    )
  }

  onChangeEmail = event => {
    this.setState({email: event.target.value})
  }

  onEmailBlur = () => {
    const {email} = this.state
    if (email === '') {
      this.setState({isEmailPresent: false})
    } else {
      this.setState({isEmailPresent: true})
    }
  }

  emailInput = () => {
    const {isEmailPresent,email,errorMessage,status} = this.state
    return (
      <div className="input-container">
        <label className="label" htmlFor="email">
          Email
        </label>
        <br />
        <input
          onChange={this.onChangeEmail}
          className="input"
          id="email"
          value={email}
          placeholder="Email"   
          onBlur={this.onEmailBlur}
          readOnly={status===apiStatusConstants.initial?false:true}
        />
        {!isEmailPresent && <p className="required">{errorMessage}</p>}
      </div>
    )
  }

  
  onChangeAmount=(event)=>{
    this.setState({amountPaid:event.target.value})
  }

  onAmountBlur=()=>{
    const {amount}=this.state;
    if(amount===''){
        this.setState({isAmountPresent:false});
    }
    else{
        this.setState({isAmountPresent:true});
    }
  }

  amountInput=()=>{
    const {isAmountPresent,amountPaid}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="amount">
          Amount
        </label>
        <br />
        <input
          onChange={this.onChangeAmount}
          className="input"
          id="amount"
          value={amountPaid}
          type="number"
          placeholder="Amount"   
          onBlur={this.onAmountBlur}
        />
        {!isAmountPresent && <p className="required">*Required</p>}
      </div>
    )
  }


  packageInput=()=>{
    const {packageType}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="package">
          Package Type: 
        </label>
        <input  
          className="input"
          id="package"
          value={packageType}
          type="text"
          readOnly
        />
      </div>
    )
  }

  onChangePaymentMethod=(event)=>{
    this.setState({paymentMethod:event.target.value})
  }
  paymentMethodInput=()=>{
    const {paymentMethod}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="method">
          Payment Method: 
        </label>
        <select  onChange={this.onChangePaymentMethod}
          className="input"
          id="package"
          value={paymentMethod}
        >
            <option value="cash">Cash</option>
            <option value="creditCard">Credit Card</option>
            <option value="debitCard">Debit Card</option>
            <option value="upi">UPI</option>
        </select>
      </div>
    )
  }

  

  onSubmitForm= async (event)=>{
    event.preventDefault();
    
    const {email}=this.state;
    if(email!==''){
      this.setState({status:apiStatusConstants.inProgress})
      const jwtToken=Cookies.get('jwt_token');
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/members/${email}`;
      const options={
        headers:{
          Authorization:`Bearer ${jwtToken}`
        },
        method:'GET'
      }
      const response=await fetch(apiUrl,options);
      if(response.ok===true){
        const fetchedData= await response.json();
        console.log(fetchedData)
        let packageType;
        if(fetchedData.package_id===5){
          packageType="1-month"
        } 
        else if(fetchedData.package_id===2){
          packageType="3-months"
        }
        else if(fetchedData.package_id===3){
          packageType="1-year"
        }
        else{
          packageType="2-years"
        }

        this.setState({
          status:apiStatusConstants.success,
          isEmailPresent:true,
          errorMessage:errorMessageConstants.required,
          name:fetchedData.name,
          email:fetchedData.email,
          packageType:packageType,
          memberId:fetchedData.id
        })
      }
      else{
        this.setState({isEmailPresent:false,status:apiStatusConstants.initial,errorMessage:errorMessageConstants.invalidEmail})
      }
    }
    else{
      this.setState({isEmailPresent:false,errorMessage:errorMessageConstants.required})
    }
  }

  initialForm=()=>{
    const {email,status}=this.state;
    return(
    <>
        <h1 className="form-heading">Enter email of member to fetch the details:</h1>
        <form className={`form ${status===apiStatusConstants.initial?'decrease-form-width':''}`} onSubmit={this.onSubmitForm}>
            {this.emailInput(email)}
            <button type="submit" className="button">
              Submit
            </button>
        </form>
    </>    
  )
  }

  onCreateBill= async (event)=>{
    event.preventDefault();

    const {name, amountPaid,paymentMethod,memberId} = this.state
      if (name !== '' &&amountPaid!=='' ) {
        const jwtToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVubWlkZnVsYXRvbm9teTlAZ21haWwuY29tIiwiaWF0IjoxNzUxMjc4MzMyfQ.VkRPIZwpQpM5fz7ri9G2qOFhcbsE5hM82zffR5NZxYs";
        const apiUrl=`http://localhost:3000/api/admin/bills/`;
        
        const data={
          name:name,
          amountPaid:parseInt(amountPaid, 10),
          method:paymentMethod,
          memberId:memberId
        }

        const options={
          headers:{
              Authorization:`Bearer ${jwtToken}`,
              'Content-Type':'Application/json'
          },
          method: 'POST',
          body:  JSON.stringify(data)      
        }  
        const response = await fetch(apiUrl,options);
        if(response.ok===true){
          this.setState({status:apiStatusConstants.billPosted})
        }
        else{
          throw new Error('Something went wrong!');
        }
        
      }
      else{

          if(name===''){
              this.setState({isNamePresent:false})
          }
          if(amountPaid===''){
            this.setState({isAmountPresent:false})
          }
      }
  }


  
  successView=()=>(
    <form className="form" onSubmit={this.onCreateBill}>
      {this.nameInput()}
      {this.emailInput()}
      {this.amountInput()}
      {this.packageInput()}
      {this.paymentMethodInput()}
      <div className="buttons-container">
        <button className="button" type="submit">
            Post Bill
        </button>
       </div>
    </form>
  )

  renderLoader = () => (
      <div className="notifications-loader-container">
          <ClipLoader color="#1a305b" size={50} />
      </div>
  )


  submitAnotherResponse=()=>{
    this.setState({
      email:'',
      isEmailPresent:true,
      status:apiStatusConstants.initial
    })
  }

  billPostedView=()=>{
    return(
      <>
        <img
            className="image"
            src="https://assets.ccbp.in/frontend/react-js/success-icon-img.png"
            alt="success"
        />
        <h1 className="submitted-text">Bill Posted Successfully</h1>
        <button
            className="button"
            type="button"
            onClick={this.submitAnotherResponse}
        >
            Ok
        </button>
      </>
    )
  }

  render(){
    const  {status}=this.state;
      return (
          <div className="bg-container">
          <Header/>
          <div className="sidebar-container">
              <Sidebar/>
              <div className="dashboard-container">
                  <h1 className="dashboard-heading">Create Bill</h1>
                  <div className="card-container">
                    <div className={`form-container ${status === apiStatusConstants.success ? 'increase-width' : 'decrease-form-width'}`}>
                      {
                        status===apiStatusConstants.initial && this.initialForm() 
                      }
                      {
                        status===apiStatusConstants.success && this.successView()
                      }
                      {
                        status===apiStatusConstants.inProgress && this.renderLoader()
                      }
                      {
                        status===apiStatusConstants.billPosted && this.billPostedView()
                      }
                    </div>  
                    </div>  
                  </div>
              </div>
          </div>
      )
  }
}

export default CreateBills;
