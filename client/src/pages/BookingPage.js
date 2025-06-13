import { Layout } from "../component/Layout"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from "react-router-dom";
import { DatePicker, message, TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {showLoading, hideLoading} from '../redux/features/alertSlice';
import moment from "moment";

const BookingPage = (value) =>{
  const {user} = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();

  const getUserData = async () => {
    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorById', 
        {doctorId: params.doctorId},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if(res.data.success) {
        setDoctor(res.data.data);
        console.log('Doctor fetched successfully:', res.data.data);
      }
    } 
    catch (err) {
      console.error('Auth error:', err.response?.data || err.message);
    }
  };
    
  const handleBooking = async()=>{
    try{
      if(!date || !time){
        return message.error("Please select date and time");
      }
      setIsAvailable(true);
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/book-appointment', {
        userId: user._id,
        doctorId: params.doctorId,
        doctorInfo: doctor,
        userInfo: user, // <-- add this line
        date: date,
        time: time,
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(hideLoading());
      if(res.data.success){
        message.success(res.data.message);
      }
    }
    catch(error){
      dispatch(hideLoading());
      console.log(error)
    }
  }

  const handleAvailability = async()=>{
    try{
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/booking-availability', {
        doctorId: params.doctorId,
        date: date,
        time: time,
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      dispatch(hideLoading());
      if(res.data.success){
        setIsAvailable(true);
        //setTime(res.data.data);
        message.success(res.data.message);
      }else{
        setIsAvailable(false);
        message.error(res.data.message);
      }
    }
    catch(error){
      dispatch(hideLoading());
      console.log(error);
    }
  }
  useEffect(()=>{
    getUserData()
    //eslint-disable-next-line
  }, [])
    

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-8 drop-shadow tracking-tight">
            Book Your Appointment
          </h1>
          <div>
            {doctor && (
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h4>
                <h4 className="text-lg text-blue-700 mb-2">
                  Fees: <span className="font-bold">₹{doctor.feesPerConsultation}</span>
                </h4>
                <p className="mb-4">
                  <b>Timings:</b>{" "}
                  {doctor.timings && doctor.timings.length === 2
                    ? (
                      <span className="text-blue-600 font-mono">
                        {doctor.timings[0]} to {doctor.timings[1]}
                      </span>
                    )
                    : <span className="text-gray-400">Not available</span>
                  }
                </p>

                <div className="flex flex-col gap-4 items-center">
                  <div className="flex gap-4 w-full justify-center">
                    <DatePicker
                      format={"DD-MM-YYYY"}
                      className="w-1/2 border-blue-300 rounded shadow-sm"
                      onChange={(value) => {
                        setIsAvailable(false);
                        setDate(moment(value).format('DD-MM-YYYY'))
                      }}
                    />
                    <TimePicker
                      format={"HH:mm"}
                      className="w-1/3 border-blue-300 rounded shadow-sm"
                      onChange={(value) => {
                        setIsAvailable(false);
                        setTime(moment(value).format('HH:mm'))
                      }}
                    />
                  </div>
                  <div className="flex gap-4 w-full justify-center">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition"
                      onClick={handleAvailability}
                    >
                      Check Availability
                    </button>
                    {/* {isAvailable && (
                      <button
                        type="button"
                        className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                        onClick={handleBooking}
                      >
                        Book Now
                      </button>
                    )} */}
                    <button
                      type="button"
                      className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition"
                      onClick={handleBooking}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BookingPage;