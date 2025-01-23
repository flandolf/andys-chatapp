import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ChatHeaderProps {
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveUsername: () => void;
  onLogout: () => void;
}

export function ChatHeader({
  username,
  onUsernameChange,
  onSaveUsername,
  onLogout,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className="
        flex flex-col items-start gap-2
      "
      >
        <h1 className="text-xl font-semibold">Andy's Chat</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to Andy's Chat, {username}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Change Username</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex gap-4">
              <Input
                value={username}
                onChange={onUsernameChange}
                placeholder="New username"
              />
              <AlertDialogAction onClick={onSaveUsername}>
                Save
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={onLogout}>Logout</Button>
        <ModeToggle />
      </div>
    </div>
  );
}
