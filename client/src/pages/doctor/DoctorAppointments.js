import React, { useState, useEffect } from 'react'
import { Layout } from '../../component/Layout'
import axios from 'axios';
import moment from 'moment';
import { message, Table } from 'antd';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);


    const getAppointments = async() =>{
        try{
            const res = await axios.get('/api/v1/doctor/doctor-appointments', {
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

    const handleStatusChange = async (record, status) => {
        try{
            const res = await axios.post('/api/v1/doctor/update-status', {
                appointmentId: record._id,
                status: status
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            });

            if(res.data.success){
                message.success('Status updated successfully');
                getAppointments(); // Refresh appointments after status update
            }else{
                message.error(res.data.message);
            }
        }catch(error){
            console.log(error);
            message.error('Error updating status');
        }
    }

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
        },
        {
            title:'Actions',
            dataIndex:'actions',
            render:(text, record) => (
                <div className='flex gap-2'>
                    {record.status === 'pending' && (
                        <div className="flex gap-2">
                            {/* <button
                                className='bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-all duration-200 shadow'
                                onClick={() => handleStatusChange(record, 'approved')}
                            >
                                Approve
                            </button>
                            <button
                                className='bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all duration-200 shadow'
                                onClick={() => handleStatusChange(record, 'rejected')}
                            >
                                Reject
                            </button> */}
                            <button
                                className="bg-green-600 text-white px-5 py-1.5 rounded-full hover:bg-green-700 transition-all duration-200 shadow font-semibold"
                                onClick={() => handleStatusChange(record, 'approved')}
                                >
                                Approve
                                </button>
                                <button
                                className="bg-red-600 text-white px-5 py-1.5 rounded-full hover:bg-red-700 transition-all duration-200 shadow font-semibold"
                                onClick={() => handleStatusChange(record, 'rejected')}
                                >
                                Reject
                            </button>
                        </div>
                    )}
                </div>
            )
        }
    ]

  return (
    // <Layout>
    //     <h1 className="text-2xl font-bold text-center my-6 text-blue-700">Appointments List</h1>
    //     <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
    //         <Table
    //             columns={columns}
    //             dataSource={appointments}
    //             rowKey="_id"
    //             className="w-full"
    //             pagination={{ pageSize: 8 }}
    //         />
    //     </div>
    // </Layout>

    // Wrap your Layout content with a background
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-10">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 drop-shadow">Appointments List</h1>
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
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

export default DoctorAppointments