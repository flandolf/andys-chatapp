import { useState, useEffect } from "react";
import LoginPage from "./pages/login";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import authentication modules
import ChatPage from "@/pages/chat-page";
import Spinner from "@/components/spinner";

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

function App() {
  const [user, setUser] = useState<User | null>(null); // Set the initial state type to User | null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center align-middle">
        <Spinner />
      </div>
    );
  }

  return <div>{user ? <ChatPage /> : <LoginPage />}</div>;
}

export default App;
