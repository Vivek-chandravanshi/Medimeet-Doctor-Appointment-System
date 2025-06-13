import Layout from '../../component/Layout';
import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const Users = () => {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await axios.get('/api/v1/admin/getAllUsers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                setUsers(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span className="font-medium text-gray-800">{record.name}</span>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => (
                <span className="text-gray-700">{text}</span>
            )
        },
        {
            title: 'Doctor',
            dataIndex: 'isDoctor',
            render: (text, record) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${record.isDoctor ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.isDoctor ? 'Yes' : 'No'}
                </span>
            )
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition duration-200 shadow">
                        Block
                    </button>
                </div>
            )
        }
    ];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 drop-shadow tracking-tight">
                    Users List
                </h1>
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
                    <Table
                        columns={columns}
                        dataSource={users}
                        rowKey="_id"
                        className="w-full"
                        pagination={{ pageSize: 8 }}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Users;