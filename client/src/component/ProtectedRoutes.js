import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import axios from "axios";

export default function ProtectedRoutes({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/getUserData',
        { token: localStorage.getItem('token') },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        dispatch(hideLoading());
        <Navigate to="/login" />;
        localStorage.clear()
        // localStorage.removeItem('token');
        // window.location.href = '/login'; // Force redirect
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
    //   localStorage.removeItem('token');
    //   window.location.href = '/login'; // Force redirect
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      getUser();
    }
    // eslint-disable-next-line
  }, [user]); // Only run once on mount

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    // Optionally show a loading spinner here
    return <div>Loading...</div>;
  }

  return children;
}