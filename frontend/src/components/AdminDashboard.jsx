// import React, {useEffect,useState} from 'react'
// import { FaSignOutAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
// import {Link, useNavigate } from 'react-router-dom';
// import instance from './api';
// import Cookies from 'js-cookie';

// const AdminDashboard = () => {
//   const [problems,setProblems] = useState([]);
//   const navigate= useNavigate();
//   useEffect(()=>{
//     const fetchProblems = async() =>{
//       try {
//         const response = await instance.get('/api/v2/getAllProblems');
//         setProblems(response.data.problems);
//       } catch (error) {
//         console.log('Failed to fetch problems',error);
//       }
//     };

//     fetchProblems();
//   },[]);

//   const handleLogout = () => {
//     Cookies.remove('authToken');
//     navigate('/');
//   };

//   const handleDelete = async(id)=>{
//     try {
//       const token= localStorage.getItem('token');
//       if(!token){
//         throw new Error('No token found');
//       }

//       await instance.delete(`/api/v2/deleteProblem/${id}`,{
//         headers:{
//           Authorization:`Bearer ${token}`
//         }
//       });

//       setProblems(problems.filter(problem => problem._id!==id));
//     } catch (error) {
//       console.log('Failed to delete problem',error);
//     }
//   }
//   return (
//     <div className='min-h-screen bg-gray-100'>
//       <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
//         <h1 className="text-4xl font-extrabold tracking-wide flex items-center">
//           <FaPlus className="inline-block mr-2" />
//           Admin Dashboard
//         </h1>
//         <button
//           onClick={handleLogout}
//           className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ml-2 mr-6"
//         >
//           <FaSignOutAlt className="mr-1" />
//           Logout
//         </button>
//       </header>
//       <main className='container mx-auto p-4'>
//         <div className='bg-white p-6 rounded-lg shadow-md'>
//         <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 underline">Problems List</h2>
//             <Link to="/create-problem">
//               <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
//                 <FaPlus className="mr-2" />
//                 Create Problem
//               </button>
//             </Link>
//           </div>
//           {problems.length === 0 ? (
//             <p className="text-gray-800 text-lg font-semibold">No problems available at the moment.</p>
//           ) : (
//             <ul className="space-y-4">
//               {problems.map((problem) => (
//                 <li key={problem._id} className="border-b pb-4 flex justify-between items-center font-medium">
//                   <span className="text-lg font-semibold">{problem.problemName}</span>
//                   <div className="flex flex-row space-x-2 font-semibold">
//                     <Link to={`/problems/edit/${problem._id}`}>
//                       <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center">
//                         <FaEdit className="mr-2" />
//                         Edit
//                       </button>
//                     </Link>
//                     <button
//                       onClick={()=>handleDelete(problem._id)}
//                       className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
//                     >
//                       <FaTrashAlt className="mr-2" />
//                       Delete
//                     </button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// export default AdminDashboard
import React, { useEffect, useState } from 'react';
import { FaSignOutAlt, FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import instance from './api';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await instance.get('/api/v2/getAllProblems');
        setProblems(response.data.problems || []);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      }
    };

    fetchProblems();
  }, []);

  const handleLogout = () => {
    Cookies.remove('authToken');
    localStorage.clear();
    navigate('/');
  };

  const handleDelete = async () => {
    if (!selectedProblem) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await instance.delete(`/api/v2/deleteProblem/${selectedProblem._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProblems((prevProblems) =>
        prevProblems.filter((problem) => problem._id !== selectedProblem._id)
      );
      console.log('Problem deleted successfully');
    } catch (error) {
      console.error('Failed to delete problem:', error);
    } finally {
      closeModal();
    }
  };

  const openModal = (problem) => {
    setSelectedProblem(problem);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProblem(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide flex items-center">
          <FaPlus className="inline-block mr-2" />
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 ml-2 mr-6"
        >
          <FaSignOutAlt className="mr-1" />
          Logout
        </button>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 underline">Problems List</h2>
            <Link to="/create-problem">
              <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                <FaPlus className="mr-2" />
                Create Problem
              </button>
            </Link>
          </div>
          {problems.length === 0 ? (
            <p className="text-gray-800 text-lg font-semibold">
              No problems available at the moment.
            </p>
          ) : (
            <ul className="space-y-4">
              {problems.map((problem) => (
                <li
                  key={problem._id}
                  className="border-b pb-4 flex justify-between items-center font-medium"
                >
                  <span className="text-lg font-semibold">{problem.problemName}</span>
                  <div className="flex flex-row space-x-2 font-semibold">
                    <Link to={`/problems/edit/${problem._id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center">
                        <FaEdit className="mr-2" />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => openModal(problem)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                    >
                      <FaTrashAlt className="mr-2" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Are you sure you want to delete "{selectedProblem?.problemName}"?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
