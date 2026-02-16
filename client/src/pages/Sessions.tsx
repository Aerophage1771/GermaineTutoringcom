import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SessionRecord {
  id: number;
  user_id: string;
  date: string;
  duration: string | number;
  summary: string;
  video_link: string | null;
  transcript: string | null;
}

export default function Sessions() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);

  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      setIsFetching(true);
      const { data } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      setSessions((data as SessionRecord[]) ?? []);
      setIsFetching(false);
    };

    loadSessions();
  }, [user]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    [],
  );

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Button variant="outline" onClick={() => setLocation("/dashboard")}>
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-3xl font-normal text-gray-800">Session History</h1>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Recording</TableHead>
              <TableHead>Transcript</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={5}>Loading sessions...</TableCell>
              </TableRow>
            ) : sessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>No session history available yet.</TableCell>
              </TableRow>
            ) : (
              sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{formattedDate.format(new Date(session.date))}</TableCell>
                  <TableCell>{session.duration} hrs.</TableCell>
                  <TableCell>{session.summary}</TableCell>
                  <TableCell>
                    {session.video_link ? (
                      <a
                        className="text-blue-600 hover:underline"
                        href={session.video_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Watch Video
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {session.transcript ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTranscript(session.transcript)}
                      >
                        View
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedTranscript} onOpenChange={(open) => !open && setSelectedTranscript(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Session Transcript</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <p className="whitespace-pre-wrap text-sm text-gray-700">{selectedTranscript}</p>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
