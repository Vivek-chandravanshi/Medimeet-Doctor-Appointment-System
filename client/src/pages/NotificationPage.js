
import React from "react";
import {Layout} from "../component/Layout";
import {Tabs, message} from "antd";
import { useSelector } from "react-redux";      
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notification = ()=>{
    const {user} = useSelector((state)=> state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleMarkAllRead = async() => {
        //console.log("Marking all notifications as read");
        try{
            dispatch(showLoading());
            const res = await axios.post('api/v1/user/get-all-notifications', {userId: user._id}, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            dispatch(hideLoading());
            if(res.data.success){
                // Update user in Redux
                dispatch({
                    type: "user/setUser",
                    payload: {
                        ...user,
                        notification: [],
                        seennotification: res.data.data
                    }
                });
                message.success(res.data.message)
            }
            else{
                message.error(res.data.message)
            }
        }catch(error){
            dispatch(hideLoading());
            console.log(error)
            message.error("Something went wrong while marking all notifications as read");
        }
    };
    const handleDeleteAllRead = async()=>{
        // Logic to delete all read notifications
        //console.log("Deleting all read notifications");
        try{
            dispatch(showLoading());
            const res = await axios.post('api/v1/user/delete-all-notifications', {userId: user._id}, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            dispatch(hideLoading());
            if(res.data.success){
                message.success(res.data.message)
            }
            else{
                message.error(res.data.message)
            }
        }catch(error){
            dispatch(hideLoading());
            console.log(error)
            message.error("Something went wrong while deleting all notifications");
        }
    }
    return(
        <>
            <Layout>
                <h1 className="text-center mt-2 font-bold text-lg">Notifications Page</h1>
                <Tabs>
                    <Tabs.TabPane tab="unRead" key={0}>
                        <div className="d-flex justify-content-end">
                            <h4 className="p-2" onClick={handleMarkAllRead}>
                                Mark All Read
                            </h4>
                        </div>
                        {user?.notification.map(notificationMgs =>(
                        <div className="card">
                            <div className="card-text" onClick={() => navigate(notificationMgs.onClickPath)}>
                                {notificationMgs.message}
                            </div>
                        </div>
                        ))}
                    </Tabs.TabPane>
                
                    
               
                    <Tabs.TabPane tab="Read" key={1}>
                        <div className="d-flex justify-content-end">
                            <h4 className="p-2" onClick={handleDeleteAllRead}>
                                Delete All Read
                            </h4>
                        </div>
                        {user?.seennotification.map(notificationMgs =>(
                        <div>
                            <div onClick={navigate(notificationMgs.onClickPath)}>
                                {notificationMgs.message}
                            </div>
                        </div>
                        ))}
                    </Tabs.TabPane>
               


                </Tabs>
            </Layout>
        </>
    )
}

export default Notification;