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
import CreateProblem from './components/CreateProblem';
import EditProblem from './components/EditProblem';
import Dashboard from './components/Dashboard';
import ProblemDetails from './components/ProblemDetails';
import SolveProblem from './components/SolveProblem';

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
          <Route path='/create-problem' element={<CreateProblem/>}/>
          <Route path="/problems/edit/:id" element={<EditProblem />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/problems/:id' element={<ProblemDetails/>}/>
          <Route path='/solve-problem/:id' element={<SolveProblem/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
