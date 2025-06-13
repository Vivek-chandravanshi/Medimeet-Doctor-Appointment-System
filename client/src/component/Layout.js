import React from "react";
import { adminMenu, UserMenu } from "../Data/data";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Badge } from "antd";

export const Layout = ({ children }) => {

  const Navigate = useNavigate();
  const {user} = useSelector(state => state.user)
  
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    message.success('Logout successful');
    Navigate('/login'); // Redirect to login page
    //window.location.href = '/login'; // Force redirect to login page
  };
//===========doctor menu
  const doctorMenu = [
    {
        name:'Home',
        path:'/',
        icon:'fa-solid fa-house'
    },
    {
        name:'Appointments',
        path:'/doctor-appointments',
        icon:'fa-solid fa-list-ul'
    },
    {
        name:'Profile',
        path:`/doctor/profile/${user?._id}`,
        icon: "fa-solid fa-user"
    }
];
//===========doctor menu ==========

const SidebarMenu = user?.isAdmin ? adminMenu : user?. isDoctor? doctorMenu : UserMenu;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-[#330101] text-white shadow-md p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-center mb-6">Doc App</h3>
          <hr className="border-gray-500 mb-4" />
          <nav className="space-y-2">
            {SidebarMenu.map((item, index) => (
              <Link key={index} to={item.path} 
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 
                    ${location.pathname === item.path? "bg-white text-[#330101] font-semibold" : "hover:bg-white hover:text-[#330101]"}`}>
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </Link>
            ))}
            <div onClick={handleLogout}>
              <Link to="/login"
                className='flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 
                    hover:bg-white hover:text-[#330101]'>
                <i className='fa-solid fa-right-from-bracket'></i>
                <span>Logout</span>
              </Link>
            </div>
            
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5 space-y-5">
        <header className="h-16 bg-white shadow-sm rounded-lg flex items-center px-6 text-lg font-semibold">
          <div className="flex items-center space-x-4 ml-auto">
            <Badge count={user?.notification?.length} onClick={()=>{Navigate('/notification')}} className="cursor-pointer">
              <i class="fa-solid fa-bell"></i>
            </Badge>
            
            <Link to="/profile">{user?.name}</Link>
          </div>
        </header>
        <main className="flex-1 bg-white rounded-lg shadow-sm p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;