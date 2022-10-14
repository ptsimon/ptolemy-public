import React, { FC } from 'react'
import tm_logo_red_tag from '../assets/tm_logo_red_tag.svg'
import firebase from 'firebase/app'
import 'tailwindcss/tailwind.css'

const Header: FC = () => {
  const logout = () => {
    firebase.auth().signOut()
  }

  return (
    <div className="px-5 py-2 h-20 mx-auto bg-accent-0 flex flex-row justify-between items-center">
      <div className="flex-shrink">
        <img className="w-36" src={tm_logo_red_tag} alt="TM Logo" />
      </div>

      <div>
        <button
          className="btn btn-small border-white border text-white p-2"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Header
