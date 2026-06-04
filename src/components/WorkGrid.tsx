import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import { Project } from '../types';
import './WorkGrid.css';

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

  return (
    <Link
      className="work-block has-video"
      to={`/work/${project.slug}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="thumbnails">
        <div className="image-sizer" />
        <video
          ref={videoRef}
          className="video-thumbnail"
          src={project.videoUrl}
          muted
          loop
          playsInline
          preload="none"
        />
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt=""
            loading="lazy"
          />
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
