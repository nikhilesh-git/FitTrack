import BillItem from "../BillItem"
import { ClipLoader } from 'react-spinners';
import { Component } from "react";
import jwtDecode from "jwt-decode";
import Cookies from 'js-cookie'
import "./index.css"



class MemberBills extends Component{
    state={
        isLoading:false,
        billsList:[]
    } 
    
    componentDidMount(){
        this.getBills()
    } 

    getBills= async ()=>{
        this.setState({isLoading:true});
        const jwtToken=Cookies.get('jwt_token');
        const memberId=jwtDecode(jwtToken).id;
        const apiUrl=`http://localhost:3000/api/admin/bills/member/${memberId}`;
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
            const updatedData= fecthedData.map((bill)=>({
                id:bill.id,
                amountPaid:bill.amount_paid,
                paymentDate:bill.payment_date,
                method:bill.method,
                name:bill.name    
            }))
            this.setState({
                billsList:updatedData,
                isLoading:false
            })
        }
    }

    renderLoader = () => (
        <div className="bills-loader-container">
            <ClipLoader color="#1a305b" size={50} />
        </div>
    )

    renderBillsList=()=>{
        const {billsList}=this.state;
        return (
            <div className="bills-container">
                <h1 className="bills-heading">Bills</h1>
                <ul className="bills">
                    {
                        billsList.map((billDetails)=>(
                            <BillItem key={billDetails.id} billDetails={billDetails}/>
                        ))
                    }
                </ul>
            </div>
        )
    }
    render(){
        const {isLoading} = this.state
        return isLoading ? this.renderLoader() : this.renderBillsList()
        
    }
}
    

export default MemberBills; 