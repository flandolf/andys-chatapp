import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut, Menu } from "lucide-react";

interface ChatHeaderProps {
  username: string;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveUsername: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export function ChatHeader({
  username,
  onUsernameChange,
  onSaveUsername,
  onLogout,
  onToggleSidebar,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between p-2 md:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-semibold">Andy's Chat</h1>
          <p className="text-sm text-muted-foreground truncate hidden md:block">
            Welcome to Andy's Chat, {username}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">Edit</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-4">
              <Input
                value={username}
                onChange={onUsernameChange}
                placeholder="New username"
                className="flex-1"
              />
              <div className="flex gap-2 justify-end">
                <AlertDialogAction onClick={onSaveUsername}>
                  Save
                </AlertDialogAction>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <Button size="sm" onClick={onLogout}><LogOut className="w-4 h-4 mr-2"/>Logout</Button>
      </div>
    </div>
  );
}
