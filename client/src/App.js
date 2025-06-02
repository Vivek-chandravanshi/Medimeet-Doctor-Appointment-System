import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import Spinner from './component/spinner'
import ProtectedRoutes from './component/ProtectedRoutes'
import PublicRoute from './component/PublicRoute'
import ApplyDoctor from './pages/ApplyDoctor';
import NotificationPage from './pages/NotificationPage';
import Users from './pages/admin/Users';
import Doctors from './pages/admin/Doctors';
import Profile from './pages/doctor/Profile';

function App() {
  const {loading} = useSelector(state => state.alerts)
  return (
    <div>
      <BrowserRouter>
        {loading ? (<Spinner/>) :(
        <Routes>
          <Route path='/' element = {
                  <ProtectedRoutes>
                    <HomePage/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/apply-doctor' element = {
                  <ProtectedRoutes>
                    <ApplyDoctor/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/notification' element = {
                  <ProtectedRoutes>
                    <NotificationPage/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/admin/users' element = {
                  <ProtectedRoutes>
                    <Users/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/admin/doctors' element = {
                  <ProtectedRoutes>
                    <Doctors/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/doctor/profile/:id' element = {
                  <ProtectedRoutes>
                    <Profile/>
                  </ProtectedRoutes>
                }
          />
          <Route path='/login' element = {
            <PublicRoute>
               <Login/>
               </PublicRoute>
              } />
          <Route path='/register' element = {
              <PublicRoute>
              <Register/>
              </PublicRoute>
            } />
        </Routes>)
        }     
      </BrowserRouter>
    </div>
  );
}

export default App;