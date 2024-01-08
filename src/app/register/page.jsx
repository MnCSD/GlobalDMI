'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createUserWithEmailAndPassword  } from "firebase/auth";
import {auth} from "../../../firebase"
import Link from 'next/link';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const register = () => {
    

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;

      router.push("/dashboard")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorMessage)
      // ..
    });
  }

  const googleSignup = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)

    router.push("/dashboard")
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#0F0F0F]">

      <div className='flex flex-col items-center justify-center bg-black md:p-32 rounded-xl w-[350px] p-4 py-10 md:w-[500px]'>
      <h1 className='text-[48px] text-white font-semibold font-sans'>Register</h1>

<div className="flex flex-col items-center justify-center space-y-8 w-[100%] mt-10">
    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="py-3 w-[300px] pl-[10px] border rounded-lg text-black border-blue-400 focus:outline-0"/>
    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="py-3 w-[300px] pl-[10px] border rounded-lg text-black border-blue-400 focus:outline-0"/>
</div>

<button onClick={register} className='px-4 py-3 text-white bg-blue-400 rounded-lg mt-10'>Continue</button>

<div className='mt-6 flex flex-col space-y-4 items-center mb-5'>
    <span className='text-gray-400'>OR</span>

    <button className='flex items-center border border-blue-400 rounded-lg p-2 py-3 w-[300px] justify-center space-x-2' onClick={googleSignup}>
        <img className='w-7 h-7' src="https://static.vecteezy.com/system/resources/previews/013/948/549/original/google-logo-on-transparent-white-background-free-vector.jpg" alt="" />
        
        <span>
        Sign in with Google
        </span>
        </button>
</div>

<div className='w-[100%] text-center'>
  <span className='text-gray-500 w-[100%]'>Already have an account? <Link href="/login" className='text-blue-400'>Login</Link></span>
</div>
      </div>

     
    </main>
  )
}