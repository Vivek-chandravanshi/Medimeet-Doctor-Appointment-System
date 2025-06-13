import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {Layout} from '../component/Layout';
import { Row } from 'antd';
import DoctorList from '../component/DoctorList';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
  try {
    const res = await axios.get(
      '/api/v1/user/getAllDoctors',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    if(res.data.success) {
      setDoctors(res.data.data);
      console.log('Doctors fetched successfully:', res.data.data);
    }
  } 
  catch (err) {
    console.error('Auth error:', err.response?.data || err.message);
  }
};


  useEffect(()=>{
    getUserData()
  }, [])

  return (
    <Layout>
      {/* <h1 className="text-3xl font-bold text-center text-blue-700 my-8">HomePage</h1>
      <div className="max-w-6xl mx-auto px-4">
        <Row gutter={[24, 24]}>
          {doctors.map((doctor) => (
            <DoctorList doctor={doctor} key={doctor._id} />
          ))}
        </Row>
      </div> */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 drop-shadow-lg tracking-tight">
          Find Your Doctor
        </h1>
        <div className="max-w-6xl mx-auto sm:px-8">
          <Row gutter={[32, 32]}>
            {doctors.map((doctor) => (
              <div key={doctor._id} className="w-full md:w-1/2 lg:w-1/3 flex justify-center ml-4">
                <div className="w-full">
                  <DoctorList doctor={doctor} />
                </div>
              </div>
            ))}
          </Row>
          {doctors.length === 0 && (
            <div className="text-center text-gray-500 text-lg mt-16 animate-pulse">
              No doctors found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
};

export default HomePage