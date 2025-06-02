import Layout from '../../components/Layout';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';


const Doctors = ()=>{
    const [doctors, setDoctors] = useState([]);

    const getDoctors = async()=>{
        try{
            const res = await axios.get('/api/v1/admin/gtAllDoctors',{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            })

            if(res.data.success){
                setUsers(res.data.data);
            }
        }catch(error){
            console.log(error);
        }
    }

    const handleAccountStatus = async(record, status)=>{
        try{
            const res = await axios.post('/api/v1/admin/changeAccountStatus', {
                doctorId: record._id,
                userId: record.userId,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if(res.data.success){
                message.data.success(res.data.message);
            }
        }catch(error){
            message.error('Something went wrong');
        }
    }
    useEffect(()=>{
        getDoctors();
    },[]);
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span>{record.firstName} {record.lastName}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'phone',
            dataIndex: 'phone'
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.Authorization ? (
                        <button className='' onClick={()=>{handleAccountStatus(record, 'approved')}}>Approve</button>
                    ) : (
                        <button className=''>Reject</button>
                    )}
                </div>
            )
        }
    ];
    return (
        <Layout>
            <h1>Doctors List</h1>
        </Layout>
    )
}
export default Doctors;