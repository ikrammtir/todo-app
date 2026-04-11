import React from 'react'
import {Routes, Route} from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ToDoList from './pages/ToDo/ToDoList';
import './App.css';
import 'antd/dist/reset.css';
function App(){
  return (
   <Routes>
<Route path="/" element={<Landing/>}/>
<Route path="/Login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/to-do-list" element={<ToDoList/>}/>
   </Routes>

  )
}
export default App