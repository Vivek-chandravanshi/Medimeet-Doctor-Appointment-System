import React from 'react'
import { Layout } from '../component/Layout'
import { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Table } from 'antd';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async() =>{
        try{
            const res = await axios.get('/api/v1/user/user-appointments', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            if(res.data.success){
                setAppointments(res.data.data);
            }else{
                //console.log(res.data.message);
            }
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        getAppointments();
    }, []);

    const columns = [
        {
            title:'ID',
            dataIndex:'_id',
        },
        {
            title:'Name',
            dataIndex:'name',
            render:(text, record)=>(
                <span className="font-semibold text-blue-900">
                    {record.doctorId.firstName} {record.doctorId.lastName}
                </span>
            )
        },
        {
            title:'Phone',
            dataIndex:'phone',
            render:(text, record)=>(
                <span className="text-gray-700 font-medium">{record.doctorId.phone}</span>
            )
        },
        {
            title:'Date & Time',
            dataIndex:'date',
            render:(text, record)=>(
                <span className="text-gray-600 font-mono">
                    {moment(record.date).format('DD-MM-YYYY')} &nbsp; 
                    {moment(record.time).format('HH:mm')}
                </span>
            )
        },
        {
            title:'Status',
            dataIndex:'status',
            render: (text) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border
                    ${text === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                    text === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'}`}>
                    {text.charAt(0).toUpperCase() + text.slice(1)}
                </span>
            )
        }
    ]


  return (
    <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 drop-shadow tracking-tight">
                    Appointments List
                </h1>
                <Table
                    columns={columns}
                    dataSource={appointments}
                    rowKey="_id"
                    className="w-full"
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </div>
    </Layout>
  )
}

export default Appointments