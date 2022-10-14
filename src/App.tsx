import React, { FunctionComponent } from 'react'
import './App.css'
import useFirebaseAuth from './hooks/useFirebaseAuth'
import Login from './components/Login'
import MainPage from './pages/MainPage'

const App: FunctionComponent = () => {
  const [user, initializing, authError] = useFirebaseAuth()

  if (initializing) {
    return null
  }

  if (!user || authError) {
    return (
      <div>
        <Login />
      </div>
    )
  }

  return <MainPage />
}

export default App
