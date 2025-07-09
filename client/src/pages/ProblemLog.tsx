import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Home, Plus, Trash2, FileText } from "lucide-react";

interface ProblemLogEntry {
  id: number;
  user_id: number;
  prep_test: string;
  section: string;
  question: string;
  correct_reasoning: string | null;
  student_flaw: string | null;
  rule_for_future: string | null;
  created_at: string;
  updated_at: string;
}

interface ProblemLogForm {
  prep_test: string;
  section: string;
  question: string;
  correct_reasoning: string;
  student_flaw: string;
  rule_for_future: string;
}

export default function ProblemLog() {
  const { user, isLoading } = useAuthRedirect();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for add entry dialog - moved before early return
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProblemLogForm>({
    prep_test: "",
    section: "",
    question: "",
    correct_reasoning: "",
    student_flaw: "",
    rule_for_future: ""
  });

  // Fetch problem log entries - moved before early return
  const { data: problemLogEntries = [], isLoading: entriesLoading } = useQuery<ProblemLogEntry[]>({
    queryKey: ["/api/dashboard/problem-log"],
    enabled: !!user
  });

  // Add new entry mutation - moved before early return
  const addEntryMutation = useMutation({
    mutationFn: (data: ProblemLogForm) => apiRequest("POST", "/api/dashboard/problem-log", {
      ...data,
      user_id: user?.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/problem-log"] });
      setIsAddDialogOpen(false);
      setFormData({
        prep_test: "",
        section: "",
        question: "",
        correct_reasoning: "",
        student_flaw: "",
        rule_for_future: ""
      });
      toast({ title: "Problem log entry added successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding entry", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Delete entry mutation - moved before early return
  const deleteEntryMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/dashboard/problem-log/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/problem-log"] });
      toast({ title: "Problem log entry deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting entry", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Show loading spinner while checking authentication - moved after all hooks
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntryMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ProblemLogForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id: number) => {
    deleteEntryMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/dashboard")}
              className="flex items-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Student Problem Log</h1>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Problem Log Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prep_test">Prep Test</Label>
                    <Input
                      id="prep_test"
                      value={formData.prep_test}
                      onChange={(e) => handleInputChange("prep_test", e.target.value)}
                      placeholder="e.g., PT 92"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(e) => handleInputChange("section", e.target.value)}
                      placeholder="e.g., Section 1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) => handleInputChange("question", e.target.value)}
                      placeholder="e.g., Question 15"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="correct_reasoning">Correct Reasoning</Label>
                  <Textarea
                    id="correct_reasoning"
                    value={formData.correct_reasoning}
                    onChange={(e) => handleInputChange("correct_reasoning", e.target.value)}
                    placeholder="Explain the correct approach and reasoning..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="student_flaw">Student Flaw</Label>
                  <Textarea
                    id="student_flaw"
                    value={formData.student_flaw}
                    onChange={(e) => handleInputChange("student_flaw", e.target.value)}
                    placeholder="Describe what the student did wrong..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rule_for_future">Rule for Future</Label>
                  <Textarea
                    id="rule_for_future"
                    value={formData.rule_for_future}
                    onChange={(e) => handleInputChange("rule_for_future", e.target.value)}
                    placeholder="What rule or strategy should the student remember..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addEntryMutation.isPending}
                  >
                    {addEntryMutation.isPending ? "Adding..." : "Add Entry"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-gray-600">
          Track and review student LSAT problem areas and learning insights
        </p>
      </div>

      {/* Problem Log Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Problem Log Entries ({problemLogEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entriesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading problem log entries...</p>
            </div>
          ) : problemLogEntries.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Prep Test</TableHead>
                    <TableHead className="w-[100px]">Section</TableHead>
                    <TableHead className="w-[100px]">Question</TableHead>
                    <TableHead className="w-[200px]">Correct Reasoning</TableHead>
                    <TableHead className="w-[200px]">Student Flaw</TableHead>
                    <TableHead className="w-[200px]">Rule for Future</TableHead>
                    <TableHead className="w-[120px]">Date Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {problemLogEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.prep_test}</TableCell>
                      <TableCell>{entry.section}</TableCell>
                      <TableCell>{entry.question}</TableCell>
                      <TableCell 
                        className="text-sm"
                        title={entry.correct_reasoning || ""}
                      >
                        {truncateText(entry.correct_reasoning)}
                      </TableCell>
                      <TableCell 
                        className="text-sm"
                        title={entry.student_flaw || ""}
                      >
                        {truncateText(entry.student_flaw)}
                      </TableCell>
                      <TableCell 
                        className="text-sm"
                        title={entry.rule_for_future || ""}
                      >
                        {truncateText(entry.rule_for_future)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(entry.created_at)}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Problem Log Entry</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this problem log entry? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(entry.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No problem log entries yet</h3>
              <p className="text-sm mb-4">Start tracking student issues and learning insights.</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add First Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}