import React from 'react'
import { message } from 'antd'
import { useDispatch } from 'react-redux'
import { showLoading, hideLoading } from '../redux/features/alertSlice'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()

    const SubmitHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const values = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        try {
            dispatch(showLoading())
            const res = await axios.post('/api/v1/user/login', values);
            dispatch(hideLoading())
            if (res.data.success) {
            message.success('Login successful');

            localStorage.setItem('token', res.data.token);

            navigate('/');
            } else {
            message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            console.log(error);
            message.error('Something went wrong');
        }
    };



return (
  <div className="form-container bg-gray-100 p-6 rounded-lg shadow-md max-w-md mx-auto mt-4">
      <form onSubmit={SubmitHandler} className="flex flex-col gap-4">
        
          <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email here"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>

          <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password here"
                  className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
              Log In
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
              New User?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
              {/* <a href="/register" className="text-blue-500 hover:underline">
                  Log in here
              </a> */}
          </p>
      </form>
  </div>

  )
}

export default Login
