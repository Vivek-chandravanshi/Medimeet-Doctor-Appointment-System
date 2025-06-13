// filepath: h:\chand\Documents\Appointment-system\client\src\pages\Profile.js
import React from "react";
import { useSelector } from "react-redux";
import Layout from "../component/Layout";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-blue-100 mt-10">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Name: </span>
            <span>{user.name || `${user.firstName || ""} ${user.lastName || ""}`}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email: </span>
            <span>{user.email}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Role: </span>
            <span>{user.isDoctor ? "Doctor" : user.isAdmin ? "Admin" : "User"}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;