import React from 'react'
import './App.css'
import {BrowserRouter, Routes,Route } from 'react-router-dom';
import Form from './Form';
export default function App() {
  return (
  <>

<BrowserRouter>
   <Routes>
   <Route path='/' element={<Form/>}></Route>
   </Routes>
   </BrowserRouter>
  </>
  )
}
