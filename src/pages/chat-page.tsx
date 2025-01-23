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
import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { Message } from "@/types/message";

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
      <ChatHeader
        username={username}
        onUsernameChange={(e) => setUsername(e.target.value)}
        onSaveUsername={handleChangeUsername}
        onLogout={() => auth.signOut()}
      />

      <MessageList
        messages={messages}
        onDelete={deleteMessage}
        convertTimeStamp={convertTimeStamp}
      />

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
