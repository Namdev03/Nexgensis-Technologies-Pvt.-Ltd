import React from 'react'
import {Routes, Route } from 'react-router'
import { PagePath } from './Routes/pagePath'
import LoginPage from './Pages/LoginPage'
function App() {
  return (
    <Routes>
    <Route path={PagePath.LOGIN} element={<LoginPage/>}/>
    </Routes>
  )
}
export default App;