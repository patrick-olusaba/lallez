import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { projects as fallbackProjects } from '../data/projects';

const STORAGE_KEY = 'arradr-projects';

interface AdminContextValue {
  projects: Project[];
  addProject: (p: Omit<Project, 'id'>) => void;
  updateProject: (id: string, p: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  moveProject: (id: string, direction: 'up' | 'down') => void;
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  projects: [],
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  moveProject: () => {},
  resetToDefaults: () => {},
});

export const useProjects = () => useContext(AdminContext);

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data → fall back
  }
  return fallbackProjects;
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

let nextId = 1000;

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(loadProjects);

  // Keep a running max-id so new projects get unique ids
  useEffect(() => {
    const max = projects.reduce((max, p) => Math.max(max, parseInt(p.id, 10) || 0), 0);
    nextId = Math.max(nextId, max + 1);
  }, []);

  const persist = useCallback((updated: Project[]) => {
    setProjects(updated);
    saveProjects(updated);
  }, []);

  const addProject = useCallback(
    (data: Omit<Project, 'id'>) => {
      const id = String(nextId++);
      const slug =
        data.slug ||
        data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      const newProject: Project = { ...data, id, slug };
      persist([...projects, newProject]);
    },
    [projects, persist]
  );

  const updateProject = useCallback(
    (id: string, data: Omit<Project, 'id'>) => {
      persist(projects.map((p) => (p.id === id ? { ...data, id } : p)));
    },
    [projects, persist]
  );

  const deleteProject = useCallback(
    (id: string) => {
      persist(projects.filter((p) => p.id !== id));
    },
    [projects, persist]
  );

  const moveProject = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const idx = projects.findIndex((p) => p.id === id);
      if (idx === -1) return;
      const target = direction === 'up' ? idx - 1 : idx + 1;
      if (target < 0 || target >= projects.length) return;
      const copy = [...projects];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      persist(copy);
    },
    [projects, persist]
  );

  const resetToDefaults = useCallback(() => {
    persist([...fallbackProjects]);
  }, [persist]);

  return (
    <AdminContext.Provider
      value={{ projects, addProject, updateProject, deleteProject, moveProject, resetToDefaults }}
    >
      {children}
    </AdminContext.Provider>
  );
};
