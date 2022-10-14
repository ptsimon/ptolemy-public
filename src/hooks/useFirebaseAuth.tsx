import firebase from 'firebase/app'
import 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

/**
 * As stated by one of Firebase's engineers, it's okay to expose this API key
 * since its purpose is to identify your Firebase project on the Google Servers.
 *
 * Source: https://stackoverflow.com/questions/37482366/is-it-safe-to-expose-firebase-apikey-to-the-public/37484053#37484053
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDKm7jZYfoOCjcm_azyAR5trCfie41Wd5k',
  authDomain: 'tm-ese-tco-calculator.firebaseapp.com',
  databaseURL: 'https://tm-ese-tco-calculator-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'tm-ese-tco-calculator',
  storageBucket: 'tm-ese-tco-calculator.appspot.com',
  messagingSenderId: '1055108344055',
  appId: '1:1055108344055:web:74470121367053854b4bf2',
  measurementId: 'G-N4L21GDSYZ',
}
firebase.initializeApp(firebaseConfig)

type AuthState = [
  firebase.User | null | undefined,
  boolean,
  firebase.auth.Error | undefined
]

export default (): AuthState => {
  const auth = firebase.auth()

  const [user, initializing, authError] = useAuthState(auth)

  return [user, initializing, authError]
}
