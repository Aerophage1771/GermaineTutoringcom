import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContactTutorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

export function ContactTutorDialog({ open, onOpenChange, userId }: ContactTutorDialogProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please enter both a subject and message.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      user_id: userId,
      subject: subject.trim(),
      content: content.trim(),
    });
    setSending(false);

    if (error) {
      console.error("Failed to send message", error);
      toast({
        title: "Message not delivered",
        description: "Something went wrong. Please try again or email your tutor directly.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: "Your tutor has been notified and will follow up soon.",
    });
    setSubject("");
    setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Your Tutor</DialogTitle>
          <DialogDescription>
            Send a message to your tutor. They'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="msg-subject">Subject</Label>
            <Input
              id="msg-subject"
              placeholder="e.g. Question about next session"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-content">Message</Label>
            <Textarea
              id="msg-content"
              placeholder="Write your message here..."
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
