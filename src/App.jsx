import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import FilmList from './components/FilmList'
import NoPage from './components/NoPage'
import FilmForm from './components/FilmForm'
import FormSession from './components/FormSession'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="films" element={<FilmList />} />
          <Route path="createfilm" element={<FilmForm />} />
          <Route path="createsession" element={<FormSession />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
