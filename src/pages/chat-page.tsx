import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Message from "@/components/message";

import { getAuth, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  username: string;
  senderId: string;
}

interface UserData {
  email: string | null;
}

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
const db = getFirestore(app);
const messagesCollection = collection(db, "messages");
export function ChatPage() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentUser] = useState<UserData | null>(null);
  const [username, setUsername] = useState<string>("");

  const sendMessage = async () => {
    if (message.trim() !== "") {
      await addDoc(messagesCollection, {
        text: message,
        timestamp: new Date(),
        senderId: auth.currentUser!.uid,
        username: auth.currentUser!.displayName
          ? auth.currentUser!.displayName
          : auth.currentUser!.email,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    const q = query(messagesCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot) => {
        const updatedMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          updatedMessages.push({
            id: doc.id,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            senderId: doc.data().senderId,
            username: doc.data().username,
          });
        });
        setMessages(updatedMessages);
      }
    );

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ? { email: user.email } : null);
      setUsername(user?.displayName || ""); // Set the username
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleChangeUsername = async () => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: username }); // Update the username
      setUsername(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col h-screen border-b">
        <div className="flex-1 flex border-r">
          <div className="flex-1 flex flex-col">
            <div className="flex h-12 items-center px-4 border-b">
              <div className="flex items-center gap-2">
                <div className="font-semibold">
                  {auth.currentUser?.displayName
                    ? auth.currentUser?.displayName
                    : auth.currentUser?.email}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger>Change Username</AlertDialogTrigger>
                  <AlertDialogContent>
                    <p className="text-lg font-semibold">Change Username</p>
                    <Input
                      placeholder="New Username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleChangeUsername}>
                        Submit
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => {
                  auth.signOut();
                }}
              >
                Log out
              </Button>
            </div>
            <div className="flex-1 flex flex-col justify-end gap-4 p-4">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  messageID={message.id}
                  author={message.username}
                  content={message.text}
                  authorID={message.senderId}
                  currentUser={auth.currentUser!.uid}
                  onDelete={() => {
                    deleteDoc(doc(messagesCollection, message.id));
                  }}
                />
              ))}
            </div>
            <div
              className="
              flex items-center
              gap-2
              p-4
            "
            >
              <Input
                placeholder="Type a message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                    setMessage("");
                  }
                }}
              />
              <Button onClick={sendMessage} size="icon">
                <SendHorizontal />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
