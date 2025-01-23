import { Message } from "@/types/message";
import { useEffect, useRef } from "react";
import { MessageItem } from "./message-item";

interface MessageListProps {
  messages: Message[];
  onDelete: (messageId: string) => void;
  convertTimeStamp: (timestamp: Date) => string;
}

export function MessageList({ messages, onDelete, convertTimeStamp }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onDelete={onDelete}
          convertTimeStamp={convertTimeStamp}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}