'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Mail,
  Users,
  CalendarCheck,
  Search,
  CheckCircle2,
  Download,
  RefreshCw,
  ArrowLeft,
  Eye,
  Sparkles,
  ShieldCheck,
  X,
  Lock,
  LogOut,
  KeyRound,
  Database,
  PenSquare,
  BookOpen,
  Globe,
  Star,
  Trash2,
  Plus,
  Pencil,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getContacts,
  getJoins,
  getRegistrations,
  updateContactStatus,
  updateJoinStatus,
  updateRegistrationStatus,
  ContactSubmission,
  JoinSubmission,
  EventRegistration,
} from '@/lib/submissions-store';
import { getBlogs, saveBlog, deleteBlog, BlogPost } from '@/lib/blogs-store';

const emptyBlogForm = () => ({
  title: '',
  excerpt: '',
  content: '',
  category: 'Quantum Tech',
  coverImage: '',
  authorName: '',
  authorRole: '',
  authorEmail: '',
  readTime: '4 min read',
  status: 'Published' as 'Published' | 'Draft' | 'Archived',
  featured: false,
  tags: '',
});

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'joins' | 'registrations' | 'blogs'>('overview');
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [joins, setJoins] = useState<JoinSubmission[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<{ type: 'contact' | 'join' | 'reg' | 'blog'; data: any } | null>(null);

  // Blog editor state
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogFormData, setBlogFormData] = useState(emptyBlogForm());
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogSaveSuccess, setBlogSaveSuccess] = useState('');

  // Check login state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('qni_admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Default Admin Credentials Verification
    if (
      (loginEmail.trim().toLowerCase() === 'admin@qnexusindia.com' || loginEmail.trim().toLowerCase() === 'admin') &&
      loginPassword === 'qni@admin2026'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('qni_admin_authenticated', 'true');
    } else {
      setLoginError('Invalid admin email/username or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('qni_admin_authenticated');
  };

  // Load data & poll from store and MongoDB API
  const refreshData = async () => {
    // 1. Load initial local storage data
    const localContacts = getContacts();
    const localJoins = getJoins();
    const localRegs = getRegistrations();
    const localBlogs = getBlogs();

    setContacts(localContacts);
    setJoins(localJoins);
    setRegistrations(localRegs);
    setBlogs(localBlogs);

    // 2. Fetch and merge from MongoDB APIs
    try {
      const [resContacts, resJoins, resRegs, resBlogs] = await Promise.allSettled([
        fetch('/api/contact').then((r) => r.json()),
        fetch('/api/join').then((r) => r.json()),
        fetch('/api/register').then((r) => r.json()),
        fetch('/api/blogs').then((r) => r.json()),
      ]);

      // Merge Contacts
      if (resContacts.status === 'fulfilled' && resContacts.value?.success && Array.isArray(resContacts.value?.data)) {
        const remoteContacts = resContacts.value.data.map((c: any) => ({
          id: c._id || c.id || `c-${Date.now()}`,
          name: c.name || 'Anonymous',
          email: c.email || '',
          company: c.company || c.organization || 'N/A',
          inquiryType: c.inquiryType || 'General Inquiry',
          subject: c.subject || 'No Subject',
          message: c.message || '',
          createdAt: c.createdAt || new Date().toISOString(),
          status: c.status || 'New',
        }));

        const mergedContacts = [...localContacts];
        remoteContacts.forEach((rc: ContactSubmission) => {
          if (!mergedContacts.some((lc) => lc.id === rc.id || (lc.email === rc.email && lc.message === rc.message))) {
            mergedContacts.push(rc);
          }
        });
        setContacts(mergedContacts);
      }

      // Merge Joins
      if (resJoins.status === 'fulfilled' && resJoins.value?.success && Array.isArray(resJoins.value?.data)) {
        const remoteJoins = resJoins.value.data.map((j: any) => ({
          id: j._id || j.id || `j-${Date.now()}`,
          fullName: j.fullName || j.name || 'Anonymous',
          email: j.email || '',
          phone: j.phone || '',
          company: j.company || 'N/A',
          position: j.position || 'Student / Engineer',
          expertise: j.expertise || 'general',
          experience: j.experience || 'Beginner',
          country: j.country || 'India',
          message: j.message || '',
          createdAt: j.createdAt || new Date().toISOString(),
          status: j.status || 'Pending',
        }));

        const mergedJoins = [...localJoins];
        remoteJoins.forEach((rj: JoinSubmission) => {
          if (!mergedJoins.some((lj) => lj.id === rj.id || lj.email === rj.email)) {
            mergedJoins.push(rj);
          }
        });
        setJoins(mergedJoins);
      }

      // Merge Registrations
      if (resRegs.status === 'fulfilled' && resRegs.value?.success && Array.isArray(resRegs.value?.data)) {
        const remoteRegs = resRegs.value.data.map((r: any) => ({
          id: r._id || r.id || `r-${Date.now()}`,
          eventId: r.eventId || '1',
          eventTitle: r.eventTitle || 'Quantum Event',
          name: r.name || 'Attendee',
          email: r.email || '',
          phone: r.phone || '',
          organization: r.organization || 'Independent',
          role: r.role || 'Attendee',
          background: r.background || 'Beginner',
          teamName: r.teamName || undefined,
          createdAt: r.createdAt || new Date().toISOString(),
          status: r.status || 'Confirmed',
        }));

        const mergedRegs = [...localRegs];
        remoteRegs.forEach((rr: EventRegistration) => {
          if (!mergedRegs.some((lr) => lr.id === rr.id || (lr.email === rr.email && lr.eventId === rr.eventId))) {
            mergedRegs.push(rr);
          }
        });
        setRegistrations(mergedRegs);
      }

      // Merge Blogs
      if (resBlogs.status === 'fulfilled' && resBlogs.value?.success && Array.isArray(resBlogs.value?.data)) {
        const remoteBlogs = resBlogs.value.data;
        const mergedBlogs = [...localBlogs];
        remoteBlogs.forEach((rb: BlogPost) => {
          if (!mergedBlogs.some((lb) => lb.id === rb.id || lb.slug === rb.slug)) {
            mergedBlogs.push(rb);
          }
        });
        setBlogs(mergedBlogs);
      }
    } catch (err) {
      console.warn('API sync warning:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Update Status Handlers
  const handleContactStatus = (id: string, status: ContactSubmission['status']) => {
    updateContactStatus(id, status);
    refreshData();
  };

  const handleJoinStatus = (id: string, status: JoinSubmission['status']) => {
    updateJoinStatus(id, status);
    refreshData();
  };

  const handleRegStatus = (id: string, status: EventRegistration['status']) => {
    updateRegistrationStatus(id, status);
    refreshData();
  };

  const handleBlogToggleStatus = (blog: BlogPost) => {
    const newStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    saveBlog({ ...blog, status: newStatus });
    refreshData();
  };

  const handleBlogToggleFeatured = (blog: BlogPost) => {
    saveBlog({ ...blog, featured: !blog.featured });
    refreshData();
  };

  const handleBlogDelete = (id: string) => {
    if (confirm('Delete this blog post permanently?')) {
      deleteBlog(id);
      refreshData();
      fetch(`/api/blogs?id=${id}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const handleBlogEdit = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      coverImage: blog.coverImage,
      authorName: blog.author.name,
      authorRole: blog.author.role,
      authorEmail: blog.author.email || '',
      readTime: blog.readTime,
      status: blog.status,
      featured: blog.featured ?? false,
      tags: blog.tags.join(', '),
    });
    setShowBlogEditor(true);
  };

  const handleBlogCreate = () => {
    setEditingBlogId(null);
    setBlogFormData(emptyBlogForm());
    setShowBlogEditor(true);
  };

  const handleBlogSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSaving(true);
    setBlogSaveSuccess('');
    const tagsArray = blogFormData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const blogPayload = {
      id: editingBlogId || undefined,
      title: blogFormData.title,
      excerpt: blogFormData.excerpt,
      content: blogFormData.content,
      category: blogFormData.category,
      coverImage: blogFormData.coverImage || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      author: { name: blogFormData.authorName, role: blogFormData.authorRole, email: blogFormData.authorEmail },
      readTime: blogFormData.readTime,
      status: blogFormData.status,
      featured: blogFormData.featured,
      tags: tagsArray,
    };
    const saved = saveBlog(blogPayload);
    await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    }).catch(() => {});
    refreshData();
    setBlogSaveSuccess(editingBlogId ? 'Blog updated!' : 'Blog created & published!');
    setShowBlogEditor(false);
    setEditingBlogId(null);
    setBlogFormData(emptyBlogForm());
    setBlogSaving(false);
  };

  // Export Data to JSON
  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      contacts,
      joins,
      registrations,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qni_admin_export_${Date.now()}.json`;
    a.click();
  };

  // Filtered lists based on search query
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJoins = joins.filter(
    (j) =>
      j.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRegs = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // IF NOT AUTHENTICATED -> SHOW ADMIN LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Glow ambient background */}
        <div className="absolute w-[600px] h-[350px] bg-foreground/5 blur-[160px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Admin Console</h1>
            <p className="text-xs text-muted-foreground font-mono">Authenticate to access QNexus Executive Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter username or email"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-500 font-medium text-center">{loginError}</p>
            )}

            <Button type="submit" size="lg" className="w-full h-12 rounded-xl bg-foreground text-background font-semibold">
              Unlock Executive Console
            </Button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Return to Main Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED -> SHOW ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/95 backdrop-blur-md px-6 py-4">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-display font-bold text-foreground tracking-tight">QNexus Executive Admin</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                  <Database className="w-3 h-3" /> Real DB Ready
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Control Center & Real-Time Data Portal</p>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all records..."
                className="pl-9 pr-4 py-2 rounded-full border border-foreground/15 bg-foreground/5 text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-foreground/40 w-48 sm:w-64 transition-all"
              />
            </div>
            <Button variant="outline" size="sm" onClick={refreshData} className="rounded-full text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button size="sm" onClick={handleExportData} className="rounded-full text-xs gap-1.5 bg-foreground text-background">
              <Download className="w-3.5 h-3.5" /> Export Data
            </Button>
            <Button size="sm" variant="ghost" onClick={handleLogout} className="rounded-full text-xs gap-1 text-rose-500 hover:text-rose-600">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 max-w-[1500px] w-full mx-auto p-6 lg:p-8 grid lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-3">
          <div className="p-2 rounded-2xl border border-foreground/10 bg-foreground/5 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Analytics</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'contacts'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Inquiries</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-foreground/15 font-bold">
                {contacts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('joins')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'joins'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Join Applications</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-foreground/15 font-bold">
                {joins.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('registrations')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'registrations'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" />
                <span>Event Registrations</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-foreground/15 font-bold">
                {registrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'blogs'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <PenSquare className="w-4 h-4 text-purple-400" />
                <span>Blogs Management</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-foreground/15 font-bold">
                {blogs.length}
              </span>
            </button>

            <Link
              href="/team-portal"
              target="_blank"
              className="w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all mt-2"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>Team Writer Portal</span>
              </div>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/events"
              className="w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all mt-1"
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-4 h-4" />
                <span>+ Create & Manage Events</span>
              </div>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Database Setup Helper Note */}
          <div className="p-5 rounded-2xl border border-foreground/10 bg-background space-y-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-bold font-sans text-sm">
              <Database className="w-4 h-4 text-sky-500" />
              <span>MongoDB Integration</span>
            </div>
            <p className="leading-relaxed">
              To connect real MongoDB: Add <code className="text-foreground bg-foreground/10 px-1 rounded">MONGODB_URI</code> to your <code className="text-foreground bg-foreground/10 px-1 rounded">.env.local</code> file.
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-9 space-y-8">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* KPI Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Contact Enquiries</span>
                    <Mail className="w-4 h-4 text-sky-500" />
                  </div>
                  <p className="font-display text-4xl font-bold text-foreground">{contacts.length}</p>
                  <p className="text-xs text-emerald-500 font-mono">
                    {contacts.filter((c) => c.status === 'New').length} Pending
                  </p>
                </div>

                <div className="p-6 rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Join Applications</span>
                    <Users className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="font-display text-4xl font-bold text-foreground">{joins.length}</p>
                  <p className="text-xs text-amber-500 font-mono">
                    {joins.filter((j) => j.status === 'Pending').length} Pending
                  </p>
                </div>

                <div className="p-6 rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Registrations</span>
                    <CalendarCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="font-display text-4xl font-bold text-foreground">{registrations.length}</p>
                  <p className="text-xs text-emerald-500 font-mono">
                    {registrations.filter((r) => r.status === 'Confirmed').length} Confirmed
                  </p>
                </div>

                <div className="p-6 rounded-3xl border border-foreground/15 bg-foreground/5 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-mono text-xs uppercase tracking-wider">Blog Articles</span>
                    <PenSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="font-display text-4xl font-bold text-foreground">{blogs.length}</p>
                  <p className="text-xs text-purple-400 font-mono">
                    {blogs.filter((b) => b.status === 'Published').length} Published Live
                  </p>
                </div>
              </div>

              {/* Recent Activity Stream */}
              <div className="p-8 rounded-3xl border border-foreground/15 bg-background shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold text-foreground">Recent Submissions Activity</h3>
                  <span className="text-xs font-mono text-muted-foreground">Latest Live Entries</span>
                </div>

                <div className="space-y-3">
                  {contacts.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{c.name} <span className="text-xs font-normal text-muted-foreground">({c.company})</span></p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{c.subject}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-foreground/10 text-foreground font-semibold">
                        Contact • {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}

                  {joins.slice(0, 3).map((j) => (
                    <div key={j.id} className="p-4 rounded-2xl border border-foreground/10 bg-foreground/5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{j.fullName} <span className="text-xs font-normal text-muted-foreground">({j.company})</span></p>
                          <p className="text-xs text-muted-foreground">{j.position} • {j.country}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                        Join Us • {new Date(j.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT ENQUIRIES TABLE */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Contact Inquiries</h3>
                  <p className="text-xs text-muted-foreground font-mono">Manage and update incoming portal messages.</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Showing {filteredContacts.length} of {contacts.length} entries
                </span>
              </div>

              <div className="rounded-3xl border border-foreground/15 bg-background overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                      <tr>
                        <th className="p-4">Sender</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {filteredContacts.map((c) => (
                        <tr key={c.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.email}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-foreground/10 text-foreground">
                              {c.inquiryType}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{c.subject}</p>
                          </td>
                          <td className="p-4 text-xs font-mono text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleContactStatus(c.id, e.target.value as any)}
                              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-foreground/10 border border-foreground/15 text-foreground focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDetail({ type: 'contact', data: c })}
                              className="h-8 px-3 rounded-full text-xs gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JOIN APPLICATIONS TABLE */}
          {activeTab === 'joins' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Join Applications</h3>
                  <p className="text-xs text-muted-foreground font-mono">Review candidate profiles for QNexus network access.</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Showing {filteredJoins.length} of {joins.length} entries
                </span>
              </div>

              <div className="rounded-3xl border border-foreground/15 bg-background overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                      <tr>
                        <th className="p-4">Applicant</th>
                        <th className="p-4">Organization & Role</th>
                        <th className="p-4">Expertise</th>
                        <th className="p-4">Country</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {filteredJoins.map((j) => (
                        <tr key={j.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">{j.fullName}</p>
                            <p className="text-xs text-muted-foreground">{j.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-foreground text-xs">{j.company}</p>
                            <p className="text-xs text-muted-foreground">{j.position}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-foreground/10 text-foreground font-semibold">
                              {j.expertise}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-mono text-muted-foreground">{j.country}</td>
                          <td className="p-4">
                            <select
                              value={j.status}
                              onChange={(e) => handleJoinStatus(j.id, e.target.value as any)}
                              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-foreground/10 border border-foreground/15 text-foreground focus:outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDetail({ type: 'join', data: j })}
                              className="h-8 px-3 rounded-full text-xs gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVENT REGISTRATIONS TABLE */}
          {activeTab === 'registrations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Event Registrations</h3>
                  <p className="text-xs text-muted-foreground font-mono">Track participant seats for workshops & hackathons.</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  Showing {filteredRegs.length} of {registrations.length} entries
                </span>
              </div>

              <div className="rounded-3xl border border-foreground/15 bg-background overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                      <tr>
                        <th className="p-4">Registrant</th>
                        <th className="p-4">Event Title</th>
                        <th className="p-4">Organization</th>
                        <th className="p-4">Level</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {filteredRegs.map((r) => (
                        <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-foreground text-xs line-clamp-1">{r.eventTitle}</p>
                            {r.teamName && <p className="text-[10px] font-mono text-amber-500">Team: {r.teamName}</p>}
                          </td>
                          <td className="p-4 text-xs text-muted-foreground">{r.organization}</td>
                          <td className="p-4">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-foreground/10 text-foreground">
                              {r.background}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={r.status}
                              onChange={(e) => handleRegStatus(r.id, e.target.value as any)}
                              className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-foreground/10 border border-foreground/15 text-foreground focus:outline-none"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Attended">Attended</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedDetail({ type: 'reg', data: r })}
                              className="h-8 px-3 rounded-full text-xs gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BLOGS MANAGEMENT TABLE */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {blogSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {blogSaveSuccess}
                </div>
              )}

              {/* Inline Blog Editor Modal */}
              {showBlogEditor && (
                <div className="border border-foreground/15 bg-foreground/[0.03] rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
                    <div className="flex items-center gap-2">
                      {editingBlogId ? <Pencil className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-purple-400" />}
                      <h3 className="font-display text-xl font-bold">{editingBlogId ? 'Edit Blog Post' : 'Create Blog Post'}</h3>
                    </div>
                    <button onClick={() => setShowBlogEditor(false)} className="p-1.5 rounded-full hover:bg-foreground/10"><X className="w-4 h-4" /></button>
                  </div>
                  <form onSubmit={handleBlogSave} className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Title *</label>
                      <input required type="text" value={blogFormData.title} onChange={e => setBlogFormData(p => ({...p, title: e.target.value}))}
                        placeholder="Blog post title" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Category</label>
                      <input type="text" value={blogFormData.category} onChange={e => setBlogFormData(p => ({...p, category: e.target.value}))}
                        placeholder="Quantum Algorithms" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Status</label>
                      <select value={blogFormData.status} onChange={e => setBlogFormData(p => ({...p, status: e.target.value as any}))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50">
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Author Name *</label>
                      <input required type="text" value={blogFormData.authorName} onChange={e => setBlogFormData(p => ({...p, authorName: e.target.value}))}
                        placeholder="Dr. Ramesh Nair" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Author Role</label>
                      <input type="text" value={blogFormData.authorRole} onChange={e => setBlogFormData(p => ({...p, authorRole: e.target.value}))}
                        placeholder="CTO & Co-Founder" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Read Time</label>
                      <input type="text" value={blogFormData.readTime} onChange={e => setBlogFormData(p => ({...p, readTime: e.target.value}))}
                        placeholder="6 min read" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Cover Image URL</label>
                      <input type="url" value={blogFormData.coverImage} onChange={e => setBlogFormData(p => ({...p, coverImage: e.target.value}))}
                        placeholder="https://images.unsplash.com/..." className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-xs font-mono text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Tags (comma-separated)</label>
                      <input type="text" value={blogFormData.tags} onChange={e => setBlogFormData(p => ({...p, tags: e.target.value}))}
                        placeholder="VQE, Qiskit, Optimization" className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Excerpt *</label>
                      <textarea required rows={2} value={blogFormData.excerpt} onChange={e => setBlogFormData(p => ({...p, excerpt: e.target.value}))}
                        placeholder="Brief description shown on blog listing..." className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">Content (Markdown) *</label>
                      <textarea required rows={10} value={blogFormData.content} onChange={e => setBlogFormData(p => ({...p, content: e.target.value}))}
                        placeholder="Write your blog content in Markdown..." className="w-full px-3.5 py-2.5 rounded-xl border border-foreground/15 bg-background text-sm font-mono text-foreground focus:outline-none focus:border-foreground/50" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={blogFormData.featured} onChange={e => setBlogFormData(p => ({...p, featured: e.target.checked}))} className="rounded" />
                        <span className="text-muted-foreground font-mono text-xs">Mark as Featured</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                      <Button type="submit" disabled={blogSaving} className="flex-1 h-11 rounded-xl bg-foreground text-background font-semibold text-sm">
                        {blogSaving ? 'Saving...' : editingBlogId ? 'Update Blog' : 'Publish Blog'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowBlogEditor(false)} className="h-11 px-5 rounded-xl">Cancel</Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Blog Articles Management</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    Overview and moderation of team member & executive blog posts.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleBlogCreate}
                    className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-foreground/90 transition-all h-9">
                    <Plus className="w-3.5 h-3.5" /> New Blog
                  </Button>
                  <Link href="/team-portal" target="_blank"
                    className="px-4 py-2 rounded-xl border border-foreground/15 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-foreground/5 transition-all">
                    Team Portal →
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-foreground/15 bg-background overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-foreground/5 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
                      <tr>
                        <th className="p-4">Article</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Featured</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/10">
                      {blogs.map((b) => (
                        <tr key={b.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-foreground line-clamp-1">{b.title}</p>
                            <p className="text-xs text-muted-foreground font-mono">/blog/{b.slug}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-foreground text-xs">{b.author.name}</p>
                            <p className="text-[10px] text-muted-foreground">{b.author.role}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-foreground/10 text-foreground">
                              {b.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleBlogToggleFeatured(b)}
                              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-mono transition-all ${
                                b.featured
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold'
                                  : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${b.featured ? 'fill-amber-400' : ''}`} />
                              {b.featured ? 'Featured' : 'Normal'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleBlogToggleStatus(b)}
                              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                                b.status === 'Published'
                                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              }`}
                            >
                              {b.status}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleBlogEdit(b)}
                                className="p-1.5 rounded-lg hover:bg-amber-500/10 text-xs text-amber-400"
                                title="Edit Blog"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <Link
                                href={`/blog/${b.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg hover:bg-foreground/10 text-xs text-muted-foreground hover:text-foreground"
                                title="Public View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleBlogDelete(b.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-xs text-rose-400"
                                title="Delete Blog"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Item Detail View Modal */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-2xl font-display font-bold text-foreground mb-4 capitalize">
              {selectedDetail.type} Record Detail
            </h3>

            <div className="space-y-3 text-sm font-sans border-t border-border pt-4">
              {Object.entries(selectedDetail.data).map(([key, val]) => (
                <div key={key} className="flex justify-between gap-4 py-1 border-b border-border/50 text-xs">
                  <span className="font-mono text-muted-foreground uppercase">{key}:</span>
                  <span className="font-medium text-foreground text-right max-w-[280px] break-words">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={() => setSelectedDetail(null)} className="rounded-full">
                Close Detail
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
