import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useState } from "react";
const firebaseConfig = {
  apiKey: "AIzaSyAZxddMlIM1JdUR-BzmrI01weJ18dUMSeg",
  authDomain: "shadcnchat.firebaseapp.com",
  projectId: "shadcnchat",
  storageBucket: "shadcnchat.appspot.com",
  messagingSenderId: "925622473788",
  appId: "1:925622473788:web:5d31cca96292b0722a9f39",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser?.displayName === null) {
        await updateProfile(auth.currentUser!, {
          displayName: email,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser!, {
        displayName: email,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/2 h-screen bg-neutral-900 p-20">
        <h1 className="text-3xl font-semibold">shadcn chat</h1>
        <p>by flandolf.</p>
        <p className="absolute bottom-20 left-20 font-semibold">(c) 2024</p>
      </div>
      <div className="w-1/2 h-screen p-20 flex flex-col justify-center align-middle space-y-3 ">
        <p className="text-3xl font-semibold">Login</p>
        <div>
          <p className="text-neutral-500">Email</p>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p className="text-neutral-500">Password</p>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-row space-x-3">
          <Button onClick={login}>Login</Button>
          <Button onClick={signUp}>Sign Up</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
