import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import NotesPage from './pages/NotesPage'
import './index.css'

function App() {
  const [page, setPage] = useState('login')

  return (
    <>
      {page === 'login' ? (
        <LoginPage setPage={setPage} />
      ) : page === 'signup' ? (
        <SignUpPage setPage={setPage} />
      ) : (
        <NotesPage setPage={setPage} />
      )}
    </>
  )
}

export default App
