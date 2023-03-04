import { useState } from 'react';
import './App.css';

import {auth, googleAuthProvider} from "./firebase";
import {signInWithPopup} from "firebase/auth";

import Login from "./components/Login";
import AccountButton from "./components/AccountButton";
import ChatUI from "./components/ChatUI";

import {db} from "./firebase";
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';


const emptyUser = undefined;

function App() {
  const [user, setUser] = useState(emptyUser);

  async function logIn() {
    const usersRef = collection(db, 'users');
    const cred = await signInWithPopup(auth, googleAuthProvider)
                        .catch((err) => console.log(err));
    // console.log(cred);
    const q = (await getDoc(doc(usersRef, cred.user.uid))).data();
    // const res = q.map((d)=>d.data());
    // console.log(q);
    if(q === undefined) {
      await setDoc(doc(usersRef, cred.user.uid), {
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL
      });
    }
    setUser(cred.user);
}

  function logOut() {
    auth.signOut()
    .then(() => {
        setUser(undefined);
        // console.log("logged out successfully");
    })
}

  return (
    <div className="App">

      {
        ((user === undefined) 
        && <Login logIn = {logIn} user={user}/>)
        || <AccountButton logOut = {logOut} user = {user} />
      }

      {
        (user !== undefined) &&
        <ChatUI user = {user} />
      }
    </div>
  );
}

export default App;
