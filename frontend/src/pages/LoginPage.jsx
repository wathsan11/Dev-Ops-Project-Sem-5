import React from 'react'
import Login from '../component/Login/Login'

const LoginPage = ({ setPage }) => {
  return (
    <div>
      <Login onSwitchToSignup={setPage} onLoginSuccess={setPage} />
    </div>
  )
}

export default LoginPage