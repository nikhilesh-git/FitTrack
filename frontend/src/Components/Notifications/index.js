import NotificationItem from "../NotificationItem"
import { ClipLoader } from 'react-spinners';
import { Component } from "react"
import Cookies from 'js-cookie'
import "./index.css"

// const notificationsList=[
//     {
//         id:1,
//         title:"Reminder for this month fee payment for monthly students",
//         message:"All the members that haven't payed the fee this month are requested to pay by tomorrow.",
//         createdAt:'2025-06-26 14:30:00'
//     },
//     {
//         id:2,
//         title:"Tomorrow Gym is Closed",
//         message:"Due to a technical issue the gym is closed tomorrow, sorry for the inconvenience.",
//         createdAt:'2025-06-29 14:30:00'
//     }
// ]

class Notifications extends Component{
    state={
        isLoading:false,
        notificationsList:[]
    } 
    
    componentDidMount(){
        this.getNotifications()
    } 

    getNotifications= async ()=>{
        this.setState({isLoading:true});
        const jwtToken=Cookies.get('jwt_token')
        const apiUrl=`${process.env.REACT_APP_API_URL}/api/admin/notifications/`;
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
            const updatedData= fecthedData.map((notification)=>({
                id:notification.id,
                title:notification.title,
                message:notification.message,
                createdAt:notification.created_at    
            }))
            this.setState({
                notificationsList:updatedData,
                isLoading:false
            })
        }
    }

    renderLoader = () => (
        <div className="notifications-loader-container">
            <ClipLoader color="#1a305b" size={50} />
        </div>
    )

    renderProductsList=()=>{
        const {notificationsList}=this.state;
        return (
            <div className="notifications-container">
                <h1 className="notifications-heading">Notifications</h1>
                <ul className="notifications">
                    {
                        notificationsList.map((notificationDetails)=>(
                            <NotificationItem key={notificationDetails.id} notificationDetails={notificationDetails}/>
                        ))
                    }
                </ul>
            </div>
        )
    }
    render(){
        const {isLoading} = this.state
        return isLoading ? this.renderLoader() : this.renderProductsList()
        
    }
}
    

export default Notifications; 