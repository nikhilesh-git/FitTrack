  import Header from "../Header"
  import Sidebar from "../Sidebar"
  import {  Component } from "react"
  import Cookies from "js-cookie";
  import "./index.css"

  class AddMember extends Component {
    state = {
      isNamePresent: true,
      isEmailPresent: true,
      isPhoneNoPresent:true,
      isAgePresent:true,
      isFormSubmitSuccess: false,
      name: '',
      email: '',
      phone:'',
      gender:"Male",
      age:'',
      packageType:"1-month",
      active:true
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
      const {isEmailPresent,email} = this.state
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
          {!isEmailPresent && <p className="required">*Required</p>}
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
    submitAnotherResponse = () => {
      this.setState({
        isNamePresent: true,
        isEmailPresent: true,
        isPhoneNoPresent:true,
        isAgePresent:true,
        isFormSubmitSuccess: false,
        name: '',
        email: '',
        phone:'',
        gender:"Male",
        age:'',
        packageType:"1-month",
        active:true
      })
    }

    onSubmitForm = async (event) => {
      event.preventDefault()
      
      const {name, email,age,phone,gender,packageType} = this.state
      if (name !== '' && email !== '' && age!=='' && phone!=='' && phone.length===10) {
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/members/`;
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
          active:true
        }

        const options={
          headers:{
              Authorization:`Bearer ${jwtToken}`,
              'Content-Type':'Application/json'
          },
          method: 'POST',
          body:  JSON.stringify(data)      
        }  
        const response=await fetch(apiUrl,options);
        if(response.ok===true){
          this.setState({isFormSubmitSuccess: true})
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

    render() {
      const {isFormSubmitSuccess} = this.state
      return (
        <div className="bg-container">
          <Header/>
          <div className="sidebar-container">
              <Sidebar/>
              <div className="container">
                  <h1 className="add-member-heading">Add Member</h1>
                  <div className="card-container">
                      <div className="form-container">
                      {!isFormSubmitSuccess ? (
                          <form className="form" onSubmit={this.onSubmitForm}>
                          {this.nameInput()}
                          {this.emailInput()}
                          {this.phoneNoInput()}
                          {this.genderInput()}
                          {this.ageInput()}
                          {this.packageInput()}
                          <button className="button" type="submit">
                              Submit
                          </button>
                          </form>
                      ) : (
                          <>
                          <img
                              className="image"
                              src="https://assets.ccbp.in/frontend/react-js/success-icon-img.png"
                              alt="success"
                          />
                          <h1 className="submitted-text">Member Added Successfully</h1>
                          <button
                              className="button"
                              type="button"
                              onClick={this.submitAnotherResponse}
                          >
                              Add Another Member
                          </button>
                          </>
                      )}
                      </div>
                  </div>
              </div>
              
          </div>
          
        </div>
      )
    }
  }

  export default AddMember;