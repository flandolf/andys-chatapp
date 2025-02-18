import { firebaseConfig } from "../../firebaseConfig";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

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
      setAlertMessage(e instanceof Error ? e.message : "An error occurred during login");
      setShowAlert(true);
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
      setAlertMessage(e instanceof Error ? e.message : "An error occurred during sign up");
      setShowAlert(true);
    }
  };
  
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert])

  return (
    <div className="flex flex-col md:flex-row">
      {showAlert && (
        <div className="absolute top-6 right-6 animate-slide-in">
          <Alert>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="w-full md:w-1/2 bg-background p-6 md:p-20 md:h-screen border-r">
        <h1 className="text-3xl font-semibold">andy's chat</h1>
        <p className="absolute bottom-6 left-6 font-semibold text-muted-foreground">
          (c) 2025
        </p>
        <div className="absolute bottom-6 right-6">
          <ModeToggle />
        </div>
      </div>
      <div className="w-full md:w-1/2 p-6 md:p-20 flex flex-col justify-center space-y-6 md:h-screen">
        <p className="text-3xl font-semibold">Login</p>
        <div>
          <p className="text-muted-foreground mb-1">Email</p>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p className="text-muted-foreground mb-1">Password</p>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row md:justify-start space-y-3 md:space-x-3 md:space-y-0 align-middle">
          <Button onClick={login}>Login</Button>
          <Button variant="outline" onClick={signUp}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
