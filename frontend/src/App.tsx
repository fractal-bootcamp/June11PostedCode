import { useState } from 'react'
import './App.css'

import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';

import {firebaseConfig} from "../firebase.config.ts"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app);


const sendAuthorizedRequest = (input: string | URL | globalThis.Request, init?: RequestInit) => {
  const token = auth.currentUser?.getIdToken();
  if (init?.headers) {
    init.headers["authorization"] = `Bearer ${token}`
  } 
  return fetch(input, init)

}


function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user)

    const response = await sendAuthorizedRequest("http://localhost:3005/user", {
      method: "POST",
      body: JSON.stringify({
        name
      })
    })
    // ...
  })
  .catch(() => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
  });
  }

  const logOut = () => {
    getAuth().signOut()
    
  }

  const runAuthenticatedRequest = async () => {
    const token = await getAuth().currentUser?.getIdToken();

    if (!token) {
      alert("You're not logged in")
    }

    const headers= { "authorization": `Bearer ${token}`}
    const result = await fetch("http://localhost:3005", {
      headers
    })

    console.log(result.status, result.body)

  }

  return (
    <>
     <div>
      Hey, I'm a react app
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signUp()}>Sign Up</button>
      <button onClick={() => logOut()}>Log Out</button>
      <button onClick={() => {runAuthenticatedRequest()}} >Trigger Request</button>
     </div>
    </>
  )
}

export default App
