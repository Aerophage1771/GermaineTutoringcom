import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, FileText, BookOpen, Settings, Pencil, Trash2, Plus,
  Key, Save, X, Loader2, ChevronDown
} from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  sessions_held: number;
  time_remaining: number;
  bonus_test_review_time: number;
  created_at?: string;
}

interface Session {
  id: number;
  user_id: number;
  date: string;
  summary: string;
  duration: number;
  video_link: string;
}

type TabType = "students" | "sessions";

function StudentsTab() {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [passwordResetId, setPasswordResetId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AdminUser> }) => {
      await apiRequest("PUT", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully" });
      setEditingId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update user", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully" });
      setDeleteConfirmId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete user", description: err.message, variant: "destructive" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: number; password: string }) => {
      await apiRequest("POST", `/api/admin/users/${id}/password`, { password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Password reset successfully" });
      setPasswordResetId(null);
      setNewPassword("");
    },
    onError: (err: Error) => {
      toast({ title: "Failed to reset password", description: err.message, variant: "destructive" });
    },
  });

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditForm({
      username: user.username,
      email: user.email,
      sessions_held: user.sessions_held,
      time_remaining: user.time_remaining,
      bonus_test_review_time: user.bonus_test_review_time,
    });
  };

  const saveEdit = () => {
    if (editingId === null) return;
    updateMutation.mutate({ id: editingId, data: editForm });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-primary text-2xl mb-6">Manage Students</h2>

      {passwordResetId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-heading text-primary">Reset Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setPasswordResetId(null); setNewPassword(""); }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => passwordMutation.mutate({ id: passwordResetId, password: newPassword })}
                  disabled={!newPassword || passwordMutation.isPending}
                  className="bg-primary text-white"
                >
                  {passwordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-heading text-primary">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/70">Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(deleteConfirmId)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/30">
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Username</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Sessions</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Time Remaining</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Bonus Time</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Created</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/10">
                {editingId === user.id ? (
                  <>
                    <td className="px-4 py-3">
                      <Input
                        value={editForm.username || ""}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{user.role}</td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={editForm.sessions_held ?? 0}
                        onChange={(e) => setEditForm({ ...editForm, sessions_held: parseInt(e.target.value) || 0 })}
                        className="h-8 text-sm w-20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={editForm.time_remaining ?? 0}
                        onChange={(e) => setEditForm({ ...editForm, time_remaining: parseInt(e.target.value) || 0 })}
                        className="h-8 text-sm w-20"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={editForm.bonus_test_review_time ?? 0}
                        onChange={(e) => setEditForm({ ...editForm, bonus_test_review_time: parseInt(e.target.value) || 0 })}
                        className="h-8 text-sm w-20"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={saveEdit} disabled={updateMutation.isPending}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-primary/10 text-primary" : "bg-accent/30 text-foreground"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.sessions_held}</td>
                    <td className="px-4 py-3 text-sm">{user.time_remaining}</td>
                    <td className="px-4 py-3 text-sm">{user.bonus_test_review_time}</td>
                    <td className="px-4 py-3 text-sm text-foreground/70">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => startEdit(user)} title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setPasswordResetId(user.id)} title="Reset Password">
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(user.id)} title="Delete" className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users && users.length === 0 && (
        <div className="text-center py-12 text-foreground/50">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No users found</p>
        </div>
      )}
    </div>
  );
}

function SessionsTab() {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Session>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Session>>({ date: "", summary: "", duration: 0, video_link: "" });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: users } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<Session[]>({
    queryKey: ["/api/admin/users", selectedUserId, "sessions"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${selectedUserId}/sessions`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      return res.json();
    },
    enabled: selectedUserId !== null,
  });

  const addMutation = useMutation({
    mutationFn: async (data: Partial<Session>) => {
      await apiRequest("POST", "/api/admin/sessions", { ...data, user_id: selectedUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users", selectedUserId, "sessions"] });
      toast({ title: "Session added successfully" });
      setShowAddForm(false);
      setAddForm({ date: "", summary: "", duration: 0, video_link: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add session", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Session> }) => {
      await apiRequest("PUT", `/api/admin/sessions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users", selectedUserId, "sessions"] });
      toast({ title: "Session updated successfully" });
      setEditingId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update session", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/sessions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users", selectedUserId, "sessions"] });
      toast({ title: "Session deleted successfully" });
      setDeleteConfirmId(null);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to delete session", description: err.message, variant: "destructive" });
    },
  });

  const startEdit = (session: Session) => {
    setEditingId(session.id);
    setEditForm({
      date: session.date,
      summary: session.summary,
      duration: session.duration,
      video_link: session.video_link,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-primary text-2xl">Manage Sessions</h2>
        {selectedUserId && (
          <Button onClick={() => setShowAddForm(true)} className="bg-accent text-primary hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" /> Add Session
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Label className="mb-2 block">Select Student</Label>
        <div className="relative w-full max-w-xs">
          <select
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border border-border rounded-lg bg-white text-sm appearance-none pr-8 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">Choose a student...</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" />
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="font-heading text-primary text-lg">Add New Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" value={addForm.date || ""} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" value={addForm.duration ?? 0} onChange={(e) => setAddForm({ ...addForm, duration: parseInt(e.target.value) || 0 })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Summary</Label>
                <Input value={addForm.summary || ""} onChange={(e) => setAddForm({ ...addForm, summary: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Video Link</Label>
                <Input value={addForm.video_link || ""} onChange={(e) => setAddForm({ ...addForm, video_link: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={() => addMutation.mutate(addForm)} disabled={addMutation.isPending} className="bg-primary text-white">
                {addMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Add Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="font-heading text-primary">Confirm Delete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/70">Are you sure you want to delete this session?</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteConfirmId)} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedUserId === null && (
        <div className="text-center py-12 text-foreground/50">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Select a student to view their sessions</p>
        </div>
      )}

      {selectedUserId !== null && sessionsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {selectedUserId !== null && sessions && (
        <div className="overflow-x-auto">
          <table className="w-full border border-border rounded-lg">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Summary</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Duration</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Video Link</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-foreground border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-border hover:bg-muted/10">
                  {editingId === session.id ? (
                    <>
                      <td className="px-4 py-3">
                        <Input type="date" value={editForm.date || ""} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <Input value={editForm.summary || ""} onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })} className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <Input type="number" value={editForm.duration ?? 0} onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 0 })} className="h-8 text-sm w-20" />
                      </td>
                      <td className="px-4 py-3">
                        <Input value={editForm.video_link || ""} onChange={(e) => setEditForm({ ...editForm, video_link: e.target.value })} className="h-8 text-sm" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => updateMutation.mutate({ id: session.id, data: editForm })} disabled={updateMutation.isPending}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm">{session.date ? new Date(session.date).toLocaleDateString() : "—"}</td>
                      <td className="px-4 py-3 text-sm">{session.summary}</td>
                      <td className="px-4 py-3 text-sm">{session.duration} min</td>
                      <td className="px-4 py-3 text-sm">
                        {session.video_link ? (
                          <a href={session.video_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => startEdit(session)} title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirmId(session.id)} title="Delete" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {sessions.length === 0 && (
            <div className="text-center py-12 text-foreground/50">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No sessions found for this student</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("students");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, user, setLocation]);

  if (authLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const tabs: { key: TabType | "blog"; label: string; icon: typeof Users }[] = [
    { key: "students", label: "Students", icon: Users },
    { key: "sessions", label: "Sessions", icon: FileText },
    { key: "blog", label: "Blog", icon: Settings },
  ];

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-primary text-3xl mb-8">Admin Dashboard</h1>

          <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              if (tab.key === "blog") {
                return (
                  <Link key={tab.key} href="/admin/blog">
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors text-foreground/70 hover:bg-muted hover:text-primary">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  </Link>
                );
              }
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "bg-primary text-white"
                      : "text-foreground/70 hover:bg-muted hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Card>
            <CardContent className="p-6">
              {activeTab === "students" && <StudentsTab />}
              {activeTab === "sessions" && <SessionsTab />}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;
