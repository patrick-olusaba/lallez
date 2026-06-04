import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import { Project } from '../types';
import './Admin.css';

const PASSWORD = 'lallez2024';

/* ── Password gate ────────────────────────────────────────────────────────────── */
const LoginGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem('admin-auth', '1');
      onUnlock();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h1>Admin</h1>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder="Password"
          className="admin-login-input"
          autoFocus
        />
        {error && <p className="admin-login-error">Wrong password</p>}
        <button type="submit" className="admin-btn admin-btn--primary">
          Unlock
        </button>
      </form>
    </div>
  );
};

/* ── Main admin panel ────────────────────────────────────────────────────────── */
const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject, updateProject, deleteProject, moveProject, resetToDefaults } =
    useProjects();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Use refs for form fields — no stale closure issues
  const clientRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const embedRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingId(null);
    setError('');
    setShowForm(true);
    // Clear form on next render via timeout
    setTimeout(() => {
      if (clientRef.current) clientRef.current.value = '';
      if (titleRef.current) titleRef.current.value = '';
      if (slugRef.current) slugRef.current.value = '';
      if (videoRef.current) videoRef.current.value = '';
      if (embedRef.current) embedRef.current.value = '';
      if (thumbRef.current) thumbRef.current.value = '';
    }, 0);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setError('');
    setShowForm(true);
    setTimeout(() => {
      if (clientRef.current) clientRef.current.value = p.client;
      if (titleRef.current) titleRef.current.value = p.title;
      if (slugRef.current) slugRef.current.value = p.slug;
      if (videoRef.current) videoRef.current.value = p.videoUrl;
      if (embedRef.current) embedRef.current.value = p.embedUrl ?? '';
      if (thumbRef.current) thumbRef.current.value = p.thumbnailUrl ?? '';
    }, 0);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clientRef.current?.value.trim() ?? '';
    const title = titleRef.current?.value.trim() ?? '';
    const slug = slugRef.current?.value.trim() ?? '';
    const videoUrl = videoRef.current?.value.trim() ?? '';
    const embedUrl = embedRef.current?.value.trim() ?? '';
    const thumbnailUrl = thumbRef.current?.value.trim() ?? '';

    if (!client || !title || (!videoUrl && !embedUrl)) {
      setError('Client, Title, and Video URL (or Embed URL) are required.');
      return;
    }

    const data = { slug, client, title, videoUrl, thumbnailUrl, embedUrl };

    if (editingId) {
      updateProject(editingId, data);
    } else {
      addProject(data);
    }

    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this project?')) {
      deleteProject(id);
      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    navigate('/');
  };

  return (
    <main className="admin-panel">
      <header className="admin-header">
        <h1>Projects <span className="admin-count">{projects.length}</span></h1>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn--primary" onClick={openAdd}>
            + Add Project
          </button>
          <button className="admin-btn admin-btn--ghost" onClick={resetToDefaults}>
            Reset to defaults
          </button>
          <button className="admin-btn admin-btn--ghost" onClick={handleLogout}>
            Lock
          </button>
        </div>
      </header>

      {/* ── Add / Edit form ─────────────────────────────────────────────────── */}
      {showForm && (
        <form className="admin-form" onSubmit={handleSave}>
          <h2>{editingId ? 'Edit Project' : 'New Project'}</h2>
          {error && <p className="admin-form-error">{error}</p>}
          <div className="admin-form-grid">
            <label>
              Client *
              <input ref={clientRef} placeholder="e.g. Cardi B & Kehlani" />
            </label>
            <label>
              Title *
              <input ref={titleRef} placeholder="e.g. Safe" />
            </label>
            <label>
              Slug (auto from title)
              <input ref={slugRef} placeholder="auto-generated" />
            </label>
            <label className="admin-form-full">
              Video URL *
              <input ref={videoRef} placeholder="https://..." />
            </label>
            <label className="admin-form-full">
              Embed URL <small>(Cloudinary / iframe player)</small>
              <input ref={embedRef} placeholder="https://player.cloudinary.com/embed/..." />
            </label>
            <label className="admin-form-full">
              Thumbnail URL
              <input ref={thumbRef} placeholder="https://..." />
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn--primary">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => { setShowForm(false); setEditingId(null); setError(''); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Project list ────────────────────────────────────────────────────── */}
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: 50 }}>#</th>
            <th>Client</th>
            <th>Title</th>
            <th>Slug</th>
            <th style={{ width: 140 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.id}>
              <td className="admin-row-num">{i + 1}</td>
              <td>{p.client}</td>
              <td>{p.title}</td>
              <td className="admin-slug">{p.slug}</td>
              <td className="admin-actions">
                <button className="admin-btn-icon" onClick={() => moveProject(p.id, 'up')} disabled={i === 0} title="Move up">
                  ↑
                </button>
                <button className="admin-btn-icon" onClick={() => moveProject(p.id, 'down')} disabled={i === projects.length - 1} title="Move down">
                  ↓
                </button>
                <button className="admin-btn-icon admin-btn-icon--edit" onClick={() => openEdit(p)} title="Edit">
                  ✎
                </button>
                <button className="admin-btn-icon admin-btn-icon--delete" onClick={() => handleDelete(p.id)} title="Delete">
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

/* ── Top-level Admin page ────────────────────────────────────────────────────── */
const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin-auth') === '1');

  if (!authed) return <LoginGate onUnlock={() => setAuthed(true)} />;
  return <AdminPanel />;
};

export default Admin;
