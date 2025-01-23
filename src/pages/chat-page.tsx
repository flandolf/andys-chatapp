import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { firebaseConfig } from "../../firebaseConfig";

import { getAuth, updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    const q = query(messagesCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const updatedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        updatedMessages.push({
          id: doc.id,
          text: doc.data().text,
          timestamp: doc.data().timestamp.toDate(),
          senderId: doc.data().senderId,
          username: doc.data().username,
        });
      });
      setMessages(updatedMessages);
    });

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user ? { email: user.email } : null);
      setUsername(user?.displayName || ""); // Set the username
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleChangeUsername = async () => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: username }); // Update the username
      setUsername(""); // Clear the input field
    }
  };

  const convertTimeStamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-black">
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="flex items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Change Username</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="flex gap-4">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="New username"
                />
                <AlertDialogAction onClick={handleChangeUsername}>
                  Save
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => auth.signOut()}>Logout</Button>
          <ModeToggle />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === auth.currentUser?.uid
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.senderId === auth.currentUser?.uid ? (
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    className={`rounded-2xl px-6 py-3 ${
                      msg.senderId === auth.currentUser?.uid
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-zinc-900"
                    }`}
                  >
                    <div className="text-sm font-medium mb-1 text-right">
                      {msg.username}
                    </div>
                    <div className="text-right">{msg.text}</div>
                    <div className="text-right text-[8pt]">
                      {convertTimeStamp(msg.timestamp)}
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => deleteMessage(msg.id)}>
                    Delete Message
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ) : (
              <div
                className={`max-w-[85%] rounded-2xl px-6 py-3 ${
                  msg.senderId === auth.currentUser?.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-zinc-900"
                }`}
              >
                <div className="text-sm font-medium mb-1 text-left">
                  {msg.username}
                </div>
                <div className="text-left">{msg.text}</div>
                <div className="text-left text-[8pt]">
                  {convertTimeStamp(msg.timestamp)}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
