import axios from 'axios';
import React, { useEffect } from 'react'
import {Layout} from '../component/Layout';

const HomePage = () => {
  const getUserData = async () => {
  try {
    const res = await axios.post(
      '/api/v1/user/getUserData',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    console.log('User Data:', res.data);
  } catch (err) {
    console.error('Auth error:', err.response?.data || err.message);
  }
};


  useEffect(()=>{
    getUserData()
  }, [])

  return (
    <Layout>
      <h1>HomePage</h1>
    </Layout>
  )
};

export default HomePage