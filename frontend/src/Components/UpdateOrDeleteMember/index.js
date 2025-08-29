import { Component } from "react"
import Header from "../Header";
import Sidebar from "../Sidebar";
import { ClipLoader } from 'react-spinners';
import Cookies from 'js-cookie'

import "./index.css"

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
  detailsUpdated:"DETAILS_UPDATED",
  memberDeleted:"MEMBER_DELETED"
};

const errorMessageConstants={
  required:"*Required",
  invalidEmail:"*Invalid Email"
}

class UpdateOrDeleteMembers extends Component{
  state={
    email:'',
    isEmailPresent:true,
    errorMessage:errorMessageConstants.required,
    status:apiStatusConstants.initial,
    name:'',
    phone:'',
    age:'',
    gender:'Male',
    packageType:'1-month',
    isNamePresent:true,
    isPhoneNoPresent:true,
    isAgePresent:true,
    active:true,
    joinDate:'',
  }

  onChangeName = event => {
    this.setState({name: event.target.value})
  }

  onNameBlur = () => {
    const {name} = this.state
    if (name === '') {
      this.setState({isNamePresent: false})
    } else {
      this.setState({isNamePresent: true})
    }
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
          className="input"
          onChange={this.onChangeName}
          id="name"
          type="text"
          value={name}
          placeholder="Name"
          onBlur={this.onNameBlur}
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
    const {isEmailPresent,email,errorMessage} = this.state
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
        />
        {!isEmailPresent && <p className="required">{errorMessage}</p>}
      </div>
    )
  }

  onChangePhoneNo=(event)=>{
    this.setState({phone:event.target.value})
  }

  onPhoneNoBlur=()=>{
    const {phone}=this.state;
    if(phone===''){
        this.setState({isPhoneNoPresent:false});
    }
    else{
        this.setState({isPhoneNoPresent:true});
    }
  }

  phoneNoInput=()=>{
    const {isPhoneNoPresent,phone}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="phoneNo">
          Phone Number
        </label>
        <br />
        <input
          onChange={this.onChangePhoneNo}
          className="input"
          type="text"
          id="phoneNo"
          value={phone}
          placeholder="Phone Number"   
          onBlur={this.onPhoneNoBlur}
        />
        {!isPhoneNoPresent && <p className="required">*Required</p>}
      </div>
    )
  }

  onChangeGender=(event)=>{
    this.setState({gender:event.target.value})
  }


  genderInput=()=>{
    const {gender}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="gender">
          Gender: 
        </label>
        <select  onChange={this.onChangeGender}
          className="input"
          id="gender"
          value={gender}
        >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>
      </div>
    )
  }
   
  onChangeAge=(event)=>{
    this.setState({age:event.target.value})
  }

  onAgeBlur=()=>{
    const {age}=this.state;
    if(age===''){
        this.setState({isAgePresent:false});
    }
    else{
        this.setState({isAgePresent:true});
    }
  }

  ageInput=()=>{
    const {isAgePresent,age}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="age">
          Age
        </label>
        <br />
        <input
          onChange={this.onChangeAge}
          className="input"
          id="age"
          value={age}
          type="number"
          placeholder="Age"   
          onBlur={this.onAgeBlur}
        />
        {!isAgePresent && <p className="required">*Required</p>}
      </div>
    )
  }

  onChangePackage=(event)=>{
    this.setState({packageType:event.target.value});
  }

  packageInput=()=>{
    const {packageType}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="package">
          Package: 
        </label>
        <select  onChange={this.onChangePackage}
          className="input"
          id="package"
          value={packageType}
        >
            <option value="1-month">Monthly(1-month)</option>
            <option value="3-months">Quaterly(3-months)</option>
            <option value="1-year">Annualy(1-year)</option>
            <option value="2-years">Premium(2-years)</option>
        </select>
      </div>
    )
  }

  onChangeActiveState=(event)=>{
    this.setState({active:event.target.value})
  }




  dateInput=()=>{
    const {joinDate}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="date">
          Joined Date
        </label>
        <br />
        <input
          className="input"
          id="date"
          value={joinDate}
          type="text"
          placeholder="Date"   
          readOnly
        />
      </div>
    )
  }

  activeStateInput=()=>{
    const {active}=this.state;
    return (
      <div className="input-container">
        <label className="label" htmlFor="activeState">
          Status: 
        </label>
        <select  onChange={this.onChangeActiveState}
          className="input"
          id="activeState"
          value={active}
        >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
        </select>
      </div>
    )
  }

  onSubmitForm= async (event)=>{
    event.preventDefault();
    
    const {email}=this.state;
    if(email!==''){
      this.setState({status:apiStatusConstants.inProgress})
      const jwtToken=Cookies.get('jwt_token')
      const apiUrl=`${process.env.REACT_APP_API_URL}/api/admin/members/${email}`;
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
          phone:fetchedData.phone,
          gender:fetchedData.gender,
          age:fetchedData.age,
          joinDate:fetchedData.join_date,
          packageType:packageType,
          active:fetchedData.active,
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

  onUpdateDetails= async (event)=>{
    event.preventDefault();

    const {name, email,age,phone,gender,packageType,active} = this.state
      if (name !== '' && email !== '' && age!=='' && phone!=='' && phone.length===10) {
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl=`${process.env.REACT_APP_API_URL}/api/admin/members/${email}`;
        let packageId;
        if(packageType==='1-month'){
          packageId=5;
        }
        else if(packageType==='2-months'){
          packageId=2
        }
        else if(packageType==='1-year'){
          packageId=3
        }
        else {
          packageId=4
        }

        const data={
          name:name,
          email:email,
          phone:phone,
          gender:gender,
          age:parseInt(age, 10),
          packageId:packageId,
          active:active
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
          this.setState({status:apiStatusConstants.detailsUpdated})
        }
        else{
          throw new Error('Something went wrong!');
        }
        
      }
      else{
          if(age===''){
              this.setState({isAgePresent:false})
          }
          if(email===''){
              this.setState({isEmailPresent:false})
          }
          if(name===''){
              this.setState({isNamePresent:false})
          }
          if(phone===''){
              this.setState({isPhoneNoPresent:false})
          }
          if(phone.length!==10){
              alert("please enter a valid phone number.")
          }
      }
  }


  onDeleteMember= async()=>{
    const {email}=this.state;
    if(email!==''){
      const jwtToken=Cookies.get('jwt_token')
      const apiUrl= `${process.env.REACT_APP_API_URL}/api/admin/members/${email}`;
      const options={
        headers:{
          Authorization:`Bearer ${jwtToken}`
        },
        method:'DELETE'
      }

      const response=await fetch(apiUrl,options);
      if(response.ok===true){
        this.setState({status:apiStatusConstants.memberDeleted})
      }
      else{
        throw new Error('Something went wrong!');
      }
    }
    else{
      this.setState({isEmailPresent:false})
    }
  }
  successView=()=>(
    <form className="form" onSubmit={this.onUpdateDetails}>
      {this.nameInput()}
      {this.emailInput()}
      {this.phoneNoInput()}
      {this.genderInput()}
      {this.ageInput()}
      {this.packageInput()}
      {this.activeStateInput()}
      {this.dateInput()}
      <div className="buttons-container">
        <button className="button" type="submit">
            Update Details
        </button>
        <button className="button delete-btn " type="button" onClick={this.onDeleteMember}>
            Delete Member
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

  detailsUpdatedOrDeletedView=()=>{
    const {status}=this.state;
    return(
      <>
        <img
            className="image"
            src="https://assets.ccbp.in/frontend/react-js/success-icon-img.png"
            alt="success"
        />
        <h1 className="submitted-text">{status===apiStatusConstants.detailsUpdated?"Details Updated Successfully.":"Member Deleted Successfully." }</h1>
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
                  <h1 className="dashboard-heading">Update/Delete Member</h1>
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
                        (status===apiStatusConstants.detailsUpdated || status===apiStatusConstants.memberDeleted) && this.detailsUpdatedOrDeletedView()
                      }
                    </div>  
                    </div>  
                  </div>
              </div>
          </div>
      )
  }
}

export default UpdateOrDeleteMembers;
