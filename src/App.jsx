import { useState } from 'react'
import Navbar from './components/navBar/NavBar'
import ApiPlayground from '../tests/APIplayground.test'
import LoginPage from './admin/login/LoginPage'
function App() {
  

  return (
    <>
      <Navbar/>
      <LoginPage/>
      { <ApiPlayground/> }
    </>
  )
}

export default App
