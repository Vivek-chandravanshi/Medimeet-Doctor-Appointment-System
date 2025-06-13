import Layout from '../../component/Layout';
import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    const getDoctors = async () => {
        try {
            const res = await axios.get('/api/v1/admin/getAllDoctors', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAccountStatus = async (record, status) => {
        try {
            const res = await axios.post('/api/v1/admin/changeAccountStatus', {
                doctorId: record._id,
                userId: record.userId,
                status: status
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                message.success(res.data.message);
                getDoctors();
            }
        } catch (error) {
            message.error('Something went wrong');
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span className="font-medium text-gray-800">{record.firstName} {record.lastName}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${text === 'approved' ? 'bg-green-100 text-green-700' :
                        text === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                    {text.charAt(0).toUpperCase() + text.slice(1)}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: (text) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="flex gap-2">
                    {record.status === 'pending' && (
                        <>
                            <button
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition-all duration-200 shadow"
                                onClick={() => handleAccountStatus(record, 'approved')}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-all duration-200 shadow"
                                onClick={() => handleAccountStatus(record, 'rejected')}
                            >
                                Reject
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 drop-shadow tracking-tight">
                    Doctors List
                </h1>
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                    <Table
                        columns={columns}
                        dataSource={doctors}
                        rowKey="_id"
                        className="w-full"
                        pagination={{ pageSize: 8 }}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Doctors;