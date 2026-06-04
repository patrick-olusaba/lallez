import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import { Project } from '../types';
import './WorkDetail.css';

/** Detect Cloudinary player embed URLs so they render as iframes even when stored in videoUrl. */
const isCloudinaryEmbed = (url: string) =>
  url.includes('player.cloudinary.com/embed');

/** Return the effective embed URL for a project, or null if it's a direct video. */
const resolveEmbedUrl = (p: Project): string | null => {
  if (p.embedUrl) return p.embedUrl;
  if (isCloudinaryEmbed(p.videoUrl)) return p.videoUrl;
  return null;
};

/** Return the direct video URL, or null if the project uses an embed. */
const resolveVideoUrl = (p: Project): string | null => {
  if (isCloudinaryEmbed(p.videoUrl)) return null;
  return p.videoUrl || null;
};

/** Ensure Cloudinary embed URLs carry autoplay/muted/loop params. */
const normalizeEmbedUrl = (url: string): string => {
  if (!isCloudinaryEmbed(url)) return url;
  const u = new URL(url);
  if (!u.searchParams.has('autoplay')) u.searchParams.set('autoplay', '1');
  if (!u.searchParams.has('muted')) u.searchParams.set('muted', '1');
  if (!u.searchParams.has('loop')) u.searchParams.set('loop', '1');
  return u.toString();
};

const WorkDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();

  const currentIndex = projects.findIndex((p) => p.slug === slug);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < projects.length - 1) {
        navigate(`/work/${projects[currentIndex + 1].slug}`);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        navigate(`/work/${projects[currentIndex - 1].slug}`);
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };
    window.addEventListener('keyup', handleKey);
    return () => window.removeEventListener('keyup', handleKey);
  }, [currentIndex, navigate]);

  if (currentIndex === -1) {
    return (
      <div className="page-work-detail">
        <div className="meta">
          <Link to="/" className="line-1" style={{ display: 'block' }}>
            Project not found
          </Link>
          <span className="line-2">← Back to Work</span>
        </div>
      </div>
    );
  }

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const embedUrl = resolveEmbedUrl(project);
  const videoUrl = resolveVideoUrl(project);

  return (
    <main className="page-work-detail">
      <div className="stage">
        {embedUrl ? (
          <iframe
            key={project.slug}
            src={normalizeEmbedUrl(embedUrl)}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            frameBorder="0"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : (
          <video
            key={project.slug}
            src={videoUrl!}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      {/* Meta info */}
      <div className="meta">
        <span className="line-1">{project.client}</span>
        <span className="line-2">{project.title}</span>
      </div>

      {/* Navigation arrows */}
      {prevProject && (
        <button
          className="nav-arrow nav-arrow--left"
          onClick={() => navigate(`/work/${prevProject.slug}`)}
          aria-label="Previous"
        >
          <ArrowLeft />
        </button>
      )}
      {nextProject && (
        <button
          className="nav-arrow nav-arrow--right"
          onClick={() => navigate(`/work/${nextProject.slug}`)}
          aria-label="Next"
        >
          <ArrowRight />
        </button>
      )}

      {/* Close button */}
      <Link className="close-btn" to="/" aria-label="Close">
        <CloseIcon />
      </Link>
    </main>
  );
};

const ArrowLeft: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8L12 16L20 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default WorkDetail;
