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
      event.preventDefault();
      const { name, email, age, phone, gender, packageType } = this.state;

      // Basic validation
      if (!name || !email || !phone || !age) {
        if (!name) this.setState({ isNamePresent: false });
        if (!email) this.setState({ isEmailPresent: false });
        if (!phone) this.setState({ isPhoneNoPresent: false });
        if (!age) this.setState({ isAgePresent: false });
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        alert("Enter a valid 10-digit phone number");
        return;
      }

      const ageInt = parseInt(age, 10);
      if (isNaN(ageInt) || ageInt <= 0) {
        alert("Enter a valid age");
        return;
      }

      // Map packageType to packageId
      const jwtToken = Cookies.get("jwt_token");
      if (!jwtToken) {
        alert("Login required");
        return;
      }

    const packageIdApiUrl = `${process.env.REACT_APP_API_URL}/api/admin/packages/${packageType}`;

    const response = await fetch(packageIdApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    });

    if (!response.ok) {
      const text = await response.text(); // read raw HTML error if any
      console.error("Server responded with error:", text);
      throw new Error("Failed to fetch package");
    }

    const packageData = await response.json();


      const packageId=packageData.id;

      const data = { name, email, phone, gender, age: ageInt, packageId, active: true };
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/admin/members/`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Backend error:", result);
          alert(result.error || "Something went wrong!");
          return;
        }

        this.setState({ isFormSubmitSuccess: true });

      } catch (err) {
        console.error("Network error:", err);
        alert("Network error occurred. Try again!");
      }
    };


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