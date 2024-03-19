import { useState } from "react";

interface MessageProps {
  author: string;
  content: string;
  onDelete?: () => void;
  messageID: string;
  currentUser: string;
  authorID: string;
}

function Message(props: MessageProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);

    if (props.onDelete) {
      props.onDelete();
    }
  };

  return (
    <div
      className="flex items-start gap-4
        justify-between p-4 border rounded-xl
    "
    >
      <div className="flex">
        <p className="text-neutral-900 dark:text-neutral-100 font-semibold">
          {props.author}
        </p>
        <span className="text-neutral-500 dark:text-neutral-400 mx-2">-</span>
        <p className="text-neutral-900 dark:text-neutral-100">
          {props.content}
        </p>
      </div>
      {props.authorID === props.currentUser && props.onDelete && (
        <button
          onClick={handleDelete}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      )}
    </div>
  );
}

export default Message;
