import React, { useState, useEffect } from 'react';
import {
  adminGetStats,
  adminGetMessages,
  adminUpdateMessageStatus,
  adminDeleteMessage,
  fetchProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  fetchSkills,
  adminCreateSkill,
  adminUpdateSkill,
  adminDeleteSkill,
  fetchExperience,
  adminCreateExperience,
  adminUpdateExperience,
  adminDeleteExperience,
  adminLogout,
} from '../../services/api';

import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  Wrench,
  Briefcase,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Archive,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Star,
} from 'lucide-react';

export default function AdminDashboard({ user, onLogout, onExitDashboard }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, messages, projects, skills, experience
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgFilter, setMsgFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [toast, setToast] = useState(null);

  // Modal States
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [isCreatingExp, setIsCreatingExp] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, title }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        const [statsRes, msgsRes, prjRes, sklRes, expRes] = await Promise.all([
          adminGetStats().catch(() => ({ data: null })),
          adminGetMessages('all').catch(() => ({ data: [] })),
          fetchProjects().catch(() => ({ data: [] })),
          fetchSkills().catch(() => ({ data: [] })),
          fetchExperience().catch(() => ({ data: [] })),
        ]);
        if (!active) return;
        if (statsRes && statsRes.data) setStats(statsRes.data);
        if (msgsRes && msgsRes.data) setMessages(msgsRes.data);
        if (prjRes && prjRes.data) setProjects(prjRes.data);
        if (sklRes && sklRes.data) setSkills(sklRes.data);
        if (expRes && expRes.data) setExperience(expRes.data);
      } catch {
        if (active) showToast('Failed to load some dashboard sections.', 'error');
      }
    };
    fetchAll();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await adminLogout();
    onLogout();
  };

  // -------------------------------------------------------------
  // Message Actions
  // -------------------------------------------------------------
  const handleUpdateStatus = async (id, status) => {
    try {
      await adminUpdateMessageStatus(id, status);
      setMessages(messages.map((m) => (m.id === id ? { ...m, status } : m)));
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, status });
      }
      showToast(`Message marked as ${status}`);
      adminGetStats().then((res) => res.data && setStats(res.data));
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await adminDeleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedMsg && selectedMsg.id === id) setSelectedMsg(null);
      setDeleteConfirm(null);
      showToast('Message deleted.');
      adminGetStats().then((res) => res.data && setStats(res.data));
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // -------------------------------------------------------------
  // Project Actions
  // -------------------------------------------------------------
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      title: fd.get('title'),
      slug: fd.get('slug'),
      description: fd.get('description'),
      detailedDescription: fd.get('detailedDescription'),
      technologies: fd.get('technologies').split(',').map((t) => t.trim()).filter(Boolean),
      liveUrl: fd.get('liveUrl'),
      githubUrl: fd.get('githubUrl'),
      featured: fd.get('featured') === 'on',
      displayOrder: parseInt(fd.get('displayOrder') || '0', 10),
    };

    try {
      if (editingProject) {
        await adminUpdateProject(editingProject.id, payload);
        showToast('Project updated successfully.');
      } else {
        await adminCreateProject(payload);
        showToast('Project created successfully.');
      }
      setIsCreatingProject(false);
      setEditingProject(null);
      fetchProjects().then((res) => setProjects(res.data || []));
      adminGetStats().then((res) => res.data && setStats(res.data));
    } catch (err) {
      showToast(err.message || 'Saving project failed.', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await adminDeleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      setDeleteConfirm(null);
      showToast('Project removed.');
      adminGetStats().then((res) => res.data && setStats(res.data));
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  // -------------------------------------------------------------
  // Skill Actions
  // -------------------------------------------------------------
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      category: fd.get('category'),
      level: fd.get('level'),
      note: fd.get('note'),
      displayOrder: parseInt(fd.get('displayOrder') || '0', 10),
    };

    try {
      if (editingSkill) {
        await adminUpdateSkill(editingSkill.id, payload);
        showToast('Skill updated.');
      } else {
        await adminCreateSkill(payload);
        showToast('Skill added.');
      }
      setIsCreatingSkill(false);
      setEditingSkill(null);
      fetchSkills().then((res) => setSkills(res.data || []));
    } catch (err) {
      showToast(err.message || 'Saving skill failed.', 'error');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await adminDeleteSkill(id);
      setSkills(skills.filter((s) => s.id !== id));
      setDeleteConfirm(null);
      showToast('Skill deleted.');
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  // -------------------------------------------------------------
  // Experience Actions
  // -------------------------------------------------------------
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const contribs = fd.get('contributions').split('\n').map((l) => l.trim()).filter(Boolean);
    const skillsList = fd.get('skillsApplied').split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: fd.get('title'),
      organization: fd.get('organization'),
      institution: fd.get('institution'),
      description: fd.get('description'),
      startDate: fd.get('startDate'),
      endDate: fd.get('endDate'),
      contributions: contribs,
      skillsApplied: skillsList,
      displayOrder: parseInt(fd.get('displayOrder') || '0', 10),
    };

    try {
      if (editingExp) {
        await adminUpdateExperience(editingExp.id, payload);
        showToast('Experience updated.');
      } else {
        await adminCreateExperience(payload);
        showToast('Experience record created.');
      }
      setIsCreatingExp(false);
      setEditingExp(null);
      fetchExperience().then((res) => setExperience(res.data || []));
    } catch (err) {
      showToast(err.message || 'Saving experience failed.', 'error');
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      await adminDeleteExperience(id);
      setExperience(experience.filter((e) => e.id !== id));
      setDeleteConfirm(null);
      showToast('Experience record deleted.');
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (msgFilter === 'unread') return m.status === 'unread';
    if (msgFilter === 'read') return m.status === 'read';
    if (msgFilter === 'archived') return m.status === 'archived';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090a0d] text-[#eceef2] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg text-xs font-mono shadow-2xl flex items-center gap-2 border ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-[#12141c] border-emerald-500/40 text-emerald-300'
          }`}
        >
          {toast.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-md border-b border-[#1f222c] px-5 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitDashboard}
              className="flex items-center gap-1.5 text-xs font-mono text-[#9ca3af] hover:text-white transition-colors"
              title="Return to Public Portfolio"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Portfolio</span>
            </button>
            <span className="text-[#5b6270]">/</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#f4f5f8]">
                Console
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SQLite Persistent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="hidden md:inline text-[#5b6270]">
              {user ? user.email : 'admin'}
            </span>
            <button
              type="button"
              onClick={onExitDashboard}
              className="px-3 py-1.5 rounded-md bg-[#161820] text-[#f4f5f8] border border-[#1f222c] hover:bg-[#1e222d] transition-all"
            >
              View Site
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-all"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex-1 w-full flex flex-col md:flex-row gap-8">
        
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'messages', label: 'Inbox', icon: MessageSquare, badge: stats?.unreadMessages },
            { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
            { id: 'skills', label: 'Skills', icon: Wrench, badge: skills.length },
            { id: 'experience', label: 'Experience', icon: Briefcase, badge: experience.length },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-[#161820] text-white font-semibold border border-[#242938]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#101217] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={isActive ? 'text-blue-400' : 'text-[#5b6270]'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] ${
                      item.id === 'messages' && stats?.unreadMessages > 0
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-[#1f222c] text-[#9ca3af]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panels */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">System Overview</h2>
                <p className="text-xs font-mono text-[#5b6270] mt-0.5">
                  Real-time metrics queried from SQLite persistent database
                </p>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#101217] border border-[#1f222c]">
                  <div className="text-[11px] font-mono text-[#5b6270] uppercase tracking-wider">Total Projects</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    {stats ? stats.totalProjects : projects.length}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">
                    {stats?.featuredProjects || 1} featured
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#101217] border border-[#1f222c]">
                  <div className="text-[11px] font-mono text-[#5b6270] uppercase tracking-wider">Total Messages</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    {stats ? stats.totalMessages : messages.length}
                  </div>
                  <div className="text-[10px] font-mono text-blue-400 mt-1">
                    {stats?.unreadMessages || 0} unread
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#101217] border border-[#1f222c]">
                  <div className="text-[11px] font-mono text-[#5b6270] uppercase tracking-wider">Verified Skills</div>
                  <div className="text-2xl font-bold text-white mt-1 font-mono">
                    {stats ? stats.totalSkills : skills.length}
                  </div>
                  <div className="text-[10px] font-mono text-[#5b6270] mt-1">
                    4 categories
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#101217] border border-[#1f222c]">
                  <div className="text-[11px] font-mono text-[#5b6270] uppercase tracking-wider">Database Status</div>
                  <div className="text-sm font-bold text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active &amp; Persistent</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#5b6270] mt-1">
                    WAL mode enabled
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-5 rounded-xl bg-[#101217] border border-[#1f222c] space-y-3">
                <div className="font-mono text-xs text-[#5b6270] uppercase tracking-wider">Quick Management</div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setIsCreatingProject(true); setActiveTab('projects'); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                  >
                    <Plus size={13} className="text-blue-400" />
                    <span>New Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreatingSkill(true); setActiveTab('skills'); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                  >
                    <Plus size={13} className="text-blue-400" />
                    <span>New Skill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsCreatingExp(true); setActiveTab('experience'); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                  >
                    <Plus size={13} className="text-blue-400" />
                    <span>New Experience</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMsgFilter('unread'); setActiveTab('messages'); }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                  >
                    <MessageSquare size={13} className="text-emerald-400" />
                    <span>View Unread ({stats?.unreadMessages || 0})</span>
                  </button>
                </div>
              </div>

              {/* Recent Messages Section */}
              <div className="rounded-xl bg-[#101217] border border-[#1f222c] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#1b1e26] flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white">Recent Inquiries</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-mono text-blue-400 hover:underline"
                  >
                    View All ({messages.length}) →
                  </button>
                </div>
                <div className="divide-y divide-[#1b1e26]">
                  {messages.slice(0, 4).map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => { setSelectedMsg(msg); setActiveTab('messages'); }}
                      className="p-4 hover:bg-[#13151e] transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{msg.name}</span>
                          <span className="text-xs text-[#5b6270]">({msg.email})</span>
                          {msg.status === 'unread' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400">new</span>
                          )}
                        </div>
                        <div className="text-xs text-[#9ca3af] mt-0.5 line-clamp-1">{msg.subject}: {msg.message}</div>
                      </div>
                      <span className="text-[11px] font-mono text-[#5b6270] shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="p-8 text-center text-xs font-mono text-[#5b6270]">No messages recorded yet.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INBOX / MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Messages Inbox</h2>
                  <p className="text-xs font-mono text-[#5b6270]">
                    Inquiries submitted via the public contact form
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 p-1 rounded-lg bg-[#14161f] border border-[#202430] text-xs font-mono">
                  {['all', 'unread', 'read', 'archived'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setMsgFilter(f)}
                      className={`px-3 py-1 rounded capitalize transition-all ${
                        msgFilter === f
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages List */}
              <div className="rounded-xl bg-[#101217] border border-[#1f222c] overflow-hidden divide-y divide-[#1b1e26]">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 sm:p-5 hover:bg-[#13151e] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs font-mono text-[#9ca3af] hover:text-blue-400"
                        >
                          {msg.email}
                        </a>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                            msg.status === 'unread'
                              ? 'bg-blue-500/20 text-blue-400 font-bold'
                              : msg.status === 'read'
                              ? 'bg-[#181b24] text-[#9ca3af]'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-[#eceef2]">{msg.subject}</div>
                      <div className="text-xs text-[#9ca3af] line-clamp-2">{msg.message}</div>
                      <div className="text-[10px] font-mono text-[#5b6270]">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedMsg(msg)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                        title="Read full message"
                      >
                        <Eye size={13} />
                      </button>
                      
                      {msg.status === 'unread' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(msg.id, 'read')}
                          className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                          title="Mark as Read"
                        >
                          <Check size={13} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(msg.id, 'unread')}
                          className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-[#161820] text-[#9ca3af] hover:text-white"
                          title="Mark as Unread"
                        >
                          Unread
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(msg.id, msg.status === 'archived' ? 'read' : 'archived')}
                        className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-[#161820] text-[#9ca3af] hover:text-white"
                        title={msg.status === 'archived' ? 'Unarchive' : 'Archive'}
                      >
                        <Archive size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'message', id: msg.id, title: `message from ${msg.name}` })}
                        className="px-2.5 py-1.5 rounded-md text-xs font-mono bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        title="Delete message"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredMessages.length === 0 && (
                  <div className="p-12 text-center text-xs font-mono text-[#5b6270]">
                    No {msgFilter !== 'all' ? msgFilter : ''} messages found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Projects Management</h2>
                  <p className="text-xs font-mono text-[#5b6270]">
                    Live projects displayed on public portfolio
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingProject(null); setIsCreatingProject(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-xl bg-[#101217] border border-[#1f222c] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        {p.featured && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            <Star size={10} />
                            <span>Featured</span>
                          </span>
                        )}
                        <h3 className="text-base font-bold text-white">{p.title}</h3>
                        <span className="text-xs font-mono text-[#5b6270]">/{p.slug}</span>
                      </div>
                      <p className="text-xs text-[#9ca3af] max-w-2xl line-clamp-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(Array.isArray(p.technologies) ? p.technologies : []).map((t) => (
                          <span key={t} className="px-2 py-0.2 rounded text-[10px] font-mono bg-[#161820] text-[#9ca3af]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => { setEditingProject(p); setIsCreatingProject(false); }}
                        className="px-3 py-1.5 rounded-md text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938] flex items-center gap-1.5"
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'project', id: p.id, title: p.title })}
                        className="px-3 py-1.5 rounded-md text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Skills &amp; Technologies</h2>
                  <p className="text-xs font-mono text-[#5b6270]">
                    Verified competencies displayed on the portfolio
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingSkill(null); setIsCreatingSkill(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                >
                  <Plus size={14} />
                  <span>Add Skill</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-[#101217] border border-[#1f222c] space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{s.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161820] text-[#9ca3af]">
                          {s.level}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-blue-400 mt-1">{s.category}</div>
                      {s.note && <p className="text-xs text-[#5b6270] mt-1 line-clamp-2">{s.note}</p>}
                    </div>

                    <div className="pt-2 border-t border-[#1a1d26] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditingSkill(s); setIsCreatingSkill(false); }}
                        className="px-2 py-1 rounded text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-[#9ca3af] hover:text-white"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'skill', id: s.id, title: s.name })}
                        className="px-2 py-1 rounded text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Experience &amp; SIWES</h2>
                  <p className="text-xs font-mono text-[#5b6270]">
                    Field training, SIWES, and project journey records
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setEditingExp(null); setIsCreatingExp(true); }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                >
                  <Plus size={14} />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {experience.map((e) => (
                  <div
                    key={e.id}
                    className="p-5 rounded-xl bg-[#101217] border border-[#1f222c] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-white">{e.title}</h3>
                        <div className="text-xs text-blue-400 font-mono mt-0.5">{e.organization}</div>
                        {e.institution && (
                          <div className="text-xs text-[#5b6270] font-mono">{e.institution}</div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditingExp(e); setIsCreatingExp(false); }}
                          className="px-3 py-1.5 rounded-md text-xs font-mono bg-[#161820] hover:bg-[#1e222d] text-white border border-[#242938]"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm({ type: 'experience', id: e.id, title: e.title })}
                          className="px-3 py-1.5 rounded-md text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#9ca3af] leading-relaxed">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODALS */}
      {/* ------------------------------------------------------------- */}

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f1117] border border-[#222633] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#1b1e28]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                  Message from
                </span>
                <h3 className="text-lg font-bold text-white">{selectedMsg.name}</h3>
                <a href={`mailto:${selectedMsg.email}`} className="text-xs font-mono text-[#9ca3af] hover:text-blue-400">
                  {selectedMsg.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="p-1 rounded text-[#9ca3af] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-mono text-[#5b6270]">
                Subject: <span className="text-[#eceef2] font-semibold">{selectedMsg.subject}</span>
              </div>
              <div className="text-xs font-mono text-[#5b6270]">
                Received: <span className="text-[#eceef2]">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-lg bg-[#14161f] border border-[#1d202b] text-sm text-[#f4f5f8] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {selectedMsg.message}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1b1e28] flex items-center justify-between">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re:%20${encodeURIComponent(selectedMsg.subject || 'Portfolio Inquiry')}`}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white font-semibold"
              >
                Reply via Email
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMsg.id, selectedMsg.status === 'read' ? 'unread' : 'read')}
                  className="px-3 py-2 rounded-lg text-xs font-mono bg-[#161820] text-white border border-[#242938]"
                >
                  Mark {selectedMsg.status === 'read' ? 'Unread' : 'Read'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(selectedMsg.id)}
                  className="px-3 py-2 rounded-lg text-xs font-mono bg-red-500/10 text-red-400 hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Create / Edit Modal */}
      {(isCreatingProject || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f1117] border border-[#222633] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1e28]">
              <h3 className="text-base font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsCreatingProject(false); setEditingProject(null); }}
                className="p-1 rounded text-[#9ca3af] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[#9ca3af] mb-1">Project Title *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingProject?.title || ''}
                  placeholder="Zapdata VTU Web App"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Slug (URL friendly) *</label>
                <input
                  name="slug"
                  required
                  defaultValue={editingProject?.slug || ''}
                  placeholder="zapdata"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Summary / Problem *</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingProject?.description || ''}
                  placeholder="Brief summary of the application..."
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Detailed Solution / Architecture</label>
                <textarea
                  name="detailedDescription"
                  rows={3}
                  defaultValue={editingProject?.detailedDescription || ''}
                  placeholder="Detailed architecture and technical choices..."
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Technologies (comma separated) *</label>
                <input
                  name="technologies"
                  required
                  defaultValue={
                    Array.isArray(editingProject?.technologies)
                      ? editingProject.technologies.join(', ')
                      : 'React, JavaScript, Tailwind CSS'
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1">Live URL</label>
                  <input
                    name="liveUrl"
                    defaultValue={editingProject?.liveUrl || ''}
                    placeholder="https://zapdata.example.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1">GitHub Repo URL</label>
                  <input
                    name="githubUrl"
                    defaultValue={editingProject?.githubUrl || ''}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-[#eceef2] cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={Boolean(editingProject?.featured)}
                    className="rounded border-[#202430]"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-[#5b6270]">Order:</span>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingProject?.displayOrder || 0}
                    className="w-16 px-2 py-1 rounded bg-[#14161f] border border-[#202430] text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#1b1e28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreatingProject(false); setEditingProject(null); }}
                  className="px-4 py-2 rounded-lg bg-[#161820] text-[#9ca3af] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Create / Edit Modal */}
      {(isCreatingSkill || editingSkill) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-[#0f1117] border border-[#222633] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1e28]">
              <h3 className="text-base font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add Technical Skill'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsCreatingSkill(false); setEditingSkill(null); }}
                className="p-1 rounded text-[#9ca3af] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[#9ca3af] mb-1">Technology Name *</label>
                <input
                  name="name"
                  required
                  defaultValue={editingSkill?.name || ''}
                  placeholder="React"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Category *</label>
                <select
                  name="category"
                  defaultValue={editingSkill?.category || 'Core Web Development'}
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                >
                  <option value="Core Web Development">Core Web Development</option>
                  <option value="Frameworks & Client Architecture">Frameworks &amp; Client Architecture</option>
                  <option value="Programming & Foundations">Programming &amp; Foundations</option>
                  <option value="Developer Tools & Environment">Developer Tools &amp; Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Proficiency Level</label>
                <input
                  name="level"
                  defaultValue={editingSkill?.level || 'Working Knowledge'}
                  placeholder="Strong Working Knowledge / Actively Building"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Practical Note</label>
                <input
                  name="note"
                  defaultValue={editingSkill?.note || ''}
                  placeholder="Semantic structure, forms, SEO"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editingSkill?.displayOrder || 0}
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div className="pt-3 border-t border-[#1b1e28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreatingSkill(false); setEditingSkill(null); }}
                  className="px-4 py-2 rounded-lg bg-[#161820] text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Create / Edit Modal */}
      {(isCreatingExp || editingExp) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-[#0f1117] border border-[#222633] p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b1e28]">
              <h3 className="text-base font-bold text-white">
                {editingExp ? 'Edit Experience' : 'Add Experience / Training Record'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsCreatingExp(false); setEditingExp(null); }}
                className="p-1 rounded text-[#9ca3af] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[#9ca3af] mb-1">Role / Position *</label>
                <input
                  name="title"
                  required
                  defaultValue={editingExp?.title || ''}
                  placeholder="Frontend Engineering Intern / SIWES Trainee"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1">Company / Organization *</label>
                  <input
                    name="organization"
                    required
                    defaultValue={editingExp?.organization || ''}
                    placeholder="Tech Studio Ltd"
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1">Academic Institution</label>
                  <input
                    name="institution"
                    defaultValue={editingExp?.institution || ''}
                    placeholder="University Name"
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Summary *</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editingExp?.description || ''}
                  placeholder="Summary of responsibilities and learning..."
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Key Contributions (one per line)</label>
                <textarea
                  name="contributions"
                  rows={3}
                  defaultValue={
                    Array.isArray(editingExp?.contributions)
                      ? editingExp.contributions.join('\n')
                      : ''
                  }
                  placeholder="Built responsive web interfaces using HTML/CSS\nDiagnosed bugs with DevTools"
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-[#9ca3af] mb-1">Skills Applied (comma separated)</label>
                <input
                  name="skillsApplied"
                  defaultValue={
                    Array.isArray(editingExp?.skillsApplied)
                      ? editingExp.skillsApplied.join(', ')
                      : 'HTML5, CSS3, JavaScript, Git'
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#9ca3af] mb-1">Start Date</label>
                  <input
                    name="startDate"
                    defaultValue={editingExp?.startDate || ''}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1">End Date</label>
                  <input
                    name="endDate"
                    defaultValue={editingExp?.endDate || ''}
                    placeholder="Present"
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#9ca3af] mb-1">Display Order</label>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingExp?.displayOrder || 0}
                    className="w-full px-3 py-2 rounded-lg bg-[#14161f] border border-[#202430] text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b1e28] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCreatingExp(false); setEditingExp(null); }}
                  className="px-4 py-2 rounded-lg bg-[#161820] text-[#9ca3af]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Destructive Action Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f1117] border border-red-500/30 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
              <p className="text-xs text-[#9ca3af] mt-1">
                Are you sure you want to permanently delete{' '}
                <span className="text-white font-semibold">"{deleteConfirm.title}"</span>?
                This action will remove it from the SQLite database.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-[#161820] text-[#9ca3af] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deleteConfirm.type === 'message') handleDeleteMessage(deleteConfirm.id);
                  if (deleteConfirm.type === 'project') handleDeleteProject(deleteConfirm.id);
                  if (deleteConfirm.type === 'skill') handleDeleteSkill(deleteConfirm.id);
                  if (deleteConfirm.type === 'experience') handleDeleteExperience(deleteConfirm.id);
                }}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
