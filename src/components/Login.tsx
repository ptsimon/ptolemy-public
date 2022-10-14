import firebase from 'firebase/app'
import React, { FunctionComponent } from 'react'
import tco_logo from '../assets/tco-revised.png'

const Login: FunctionComponent = () => {
  const provider = new firebase.auth.GoogleAuthProvider()

  const login = () => {
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center max-w-xl min-w-min mx-auto py-6 rounded-lg shadow-lg">
      <img className="w-1/3" src={tco_logo} alt="TM Logo 2" />

      <h1 className="text-4xl font-bold my-6 pb-12 text-accent-0 text-center">
        Ptolemy<br></br>TCO Calculator
      </h1>

      <button className="btn-primary btn-large" onClick={login}>
        Login
      </button>
      <h6 className="pb-2 pt-12 text-gray-4">
        (c) Thinking Machines, ESE 2021
      </h6>
    </div>
  )
}

export default Login
