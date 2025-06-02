
import Layout from '../../components/Layout';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Users = ()=>{

    const [users, setUsers] = useState([]);

    const getUsers = async()=>{
        try{
            const res = await axios.get('/api/v1/admin/gtAllUsers',{
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

    useEffect(()=>{
        getUsers();
    },[]);
    
    const columns = [
        {
            title:Name,
            dataIndex:'name'        
        },{
            title:'Email',
            dataIndex:'email'
        },{
            title:'Doctor',
            dataIndex:'isDoctor',
            render:(text, record) => (
                <span>{record.isDoctor ? 'Yes' : 'No'}</span>
            )
        },{
            title:'Actions',
            dataIndex:'actions',
            render:(text, record) => (
                <div className='d-flex'>
                    <button className=''>Block</button>
                </div>
            )
        }
    ]
    return (
        <Layout>
            <h1>Users List</h1>
            <Table columns={columns} dataSource={users}/>
        </Layout>
    )
}
export default Users;