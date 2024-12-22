import './App.css';
import './index.css'
import React from 'react';
import {Routes,Route,BrowserRouter as Router} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import Homepage from './components/Homepage';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup'element={<Signup/>}/>
          <Route path='/UserDashboard' element={<UserDashboard/>}/>
          <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
