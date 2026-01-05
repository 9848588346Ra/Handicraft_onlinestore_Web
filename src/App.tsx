import React, { useState } from 'react'
import LoginScreen from '../screens/loginscreen'
import SignupScreen from '../screens/singnupscreen'

function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'signup'>('login')

  return (
    <div className="app">
      {currentScreen === 'login' ? (
        <LoginScreen onNavigateToSignup={() => setCurrentScreen('signup')} />
      ) : (
        <SignupScreen onNavigateToLogin={() => setCurrentScreen('login')} />
      )}
    </div>
  )
}

export default App

