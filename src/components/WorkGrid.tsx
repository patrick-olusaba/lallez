import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import { Project } from '../types';
import './WorkGrid.css';

/** Detect Cloudinary player embed URLs that can't be played in a <video> tag. */
const isCloudinaryEmbed = (url: string) =>
  url.includes('player.cloudinary.com/embed');

/** Extract cloud_name and public_id from a Cloudinary embed URL. */
const parseCloudinaryParams = (url: string): { cloudName: string; publicId: string } | null => {
  try {
    const u = new URL(url);
    const cloudName = u.searchParams.get('cloud_name');
    const publicId = u.searchParams.get('public_id');
    if (cloudName && publicId) return { cloudName, publicId };
  } catch { /* invalid URL */ }
  return null;
};

/** Build a direct Cloudinary MP4 URL for hover preview. */
const buildCloudinaryVideoUrl = (cloudName: string, publicId: string) =>
  `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;

/** Build a Cloudinary thumbnail (first frame) as a poster/fallback image. */
const buildCloudinaryPosterUrl = (cloudName: string, publicId: string) =>
  `https://res.cloudinary.com/${cloudName}/video/upload/so_0/${publicId}.jpg`;

/** Get a playable video URL for hover preview, deriving from embed if needed. */
const getPreviewVideoUrl = (p: Project): string | null => {
  if (p.videoUrl && !isCloudinaryEmbed(p.videoUrl)) return p.videoUrl;
  const params = parseCloudinaryParams(p.embedUrl || p.videoUrl);
  if (params) return buildCloudinaryVideoUrl(params.cloudName, params.publicId);
  return null;
};

/** Get a poster/thumbnail URL, deriving from Cloudinary if no explicit thumbnail is set. */
const getPosterUrl = (p: Project): string | null => {
  if (p.thumbnailUrl) return p.thumbnailUrl;
  const params = parseCloudinaryParams(p.embedUrl || p.videoUrl);
  if (params) return buildCloudinaryPosterUrl(params.cloudName, params.publicId);
  return null;
};

const WorkGrid: React.FC = () => {
  const { projects } = useProjects();

  return (
    <section className="work-grid">
      {projects.map((project) => (
        <WorkBlock key={project.id} project={project} />
      ))}
    </section>
  );
};

interface WorkBlockProps {
  project: Project;
}

const WorkBlock: React.FC<WorkBlockProps> = ({ project }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, []);

  const handleMouseLeave = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
  }, []);

  const previewUrl = getPreviewVideoUrl(project);
  const posterUrl = getPosterUrl(project);

  return (
    <Link
      className={`work-block${previewUrl ? ' has-video' : ''}`}
      to={`/work/${project.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="thumbnails">
        <div className="image-sizer" />
        {previewUrl && (
          <video
            ref={videoRef}
            className="video-thumbnail"
            src={previewUrl}
            poster={posterUrl ?? undefined}
            muted
            loop
            playsInline
            preload="none"
          />
        )}
        {posterUrl && (
          <img
            src={posterUrl}
            alt=""
            loading="lazy"
          />
        )}
        {!posterUrl && !previewUrl && (
          <div className="thumb-placeholder" />
        )}
      </div>
      <div className="meta">
        <span className="line line-1">{project.client}</span>
        <span className="line line-2">{project.title}</span>
      </div>
    </Link>
  );
};

export default WorkGrid;
