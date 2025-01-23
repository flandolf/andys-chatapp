import { Message } from "@/types/message";
import { getAuth } from "firebase/auth";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface MessageItemProps {
  message: Message;
  onDelete: (messageId: string) => void;
  convertTimeStamp: (timestamp: Date) => string;
}

export function MessageItem({ message, onDelete, convertTimeStamp }: MessageItemProps) {
  const auth = getAuth();

  return (
    <div
      className={`flex ${message.senderId === auth.currentUser?.uid ? "justify-end" : "justify-start"}`}
    >
      {message.senderId === auth.currentUser?.uid ? (
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={`rounded-3xl px-6 py-3 ${message.senderId === auth.currentUser?.uid ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-zinc-900"}`}
            >
              <div className="text-sm font-medium mb-1 text-right">
                {message.username}
              </div>
              <div className="text-right">{message.text}</div>
              <div className="text-right text-[8pt]">
                {convertTimeStamp(message.timestamp)}
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onDelete(message.id)}>
              Delete Message
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ) : (
        <div
          className={`max-w-[85%] rounded-3xl px-6 py-3 ${message.senderId === auth.currentUser?.uid ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-zinc-900"}`}
        >
          <div className="text-sm font-medium mb-1 text-left">
            {message.username}
          </div>
          <div className="text-left">{message.text}</div>
          <div className="text-left text-[8pt]">
            {convertTimeStamp(message.timestamp)}
          </div>
        </div>
      )}
    </div>
  );
}