import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import { Project } from '../types';
import './Slideshow.css';

const INTERVAL_MS = 5000;

/** Detect Cloudinary embed URLs that can't be played in a <video> tag. */
const isCloudinaryEmbed = (url: string) =>
  url.includes('player.cloudinary.com/embed');

/**  Get a playable video URL for the slideshow, deriving direct URL from embed if needed.
 *  Uses Cloudinary transformations (q_auto:good,w_1920) for fast full-screen loading. */
const getSlideshowVideoUrl = (p: Project): string => {
  if (p.videoUrl && !isCloudinaryEmbed(p.videoUrl)) return p.videoUrl;
  const derive = (url: string) => {
    try {
      const u = new URL(url);
      const cn = u.searchParams.get('cloud_name');
      const pid = u.searchParams.get('public_id');
      if (cn && pid) return `https://res.cloudinary.com/${cn}/video/upload/q_auto:good,w_1920/${pid}.mp4`;
    } catch { /* fall through */ }
    return null;
  };
  if (p.embedUrl) return derive(p.embedUrl) ?? p.videoUrl ?? '';
  if (isCloudinaryEmbed(p.videoUrl)) return derive(p.videoUrl) ?? '';
  return p.videoUrl || '';
};

/** Get a poster image so there's a still frame instead of black while video loads. */
const getSlideshowPoster = (p: Project): string | undefined => {
  if (p.thumbnailUrl) return p.thumbnailUrl;
  // Derive first-frame poster from Cloudinary
  const derive = (url: string) => {
    try {
      const u = new URL(url);
      const cn = u.searchParams.get('cloud_name');
      const pid = u.searchParams.get('public_id');
      if (cn && pid) return `https://res.cloudinary.com/${cn}/video/upload/so_0/${pid}.jpg`;
    } catch { /* fall through */ }
    return null;
  };
  if (p.embedUrl) return derive(p.embedUrl) ?? undefined;
  if (isCloudinaryEmbed(p.videoUrl)) return derive(p.videoUrl) ?? undefined;
  return undefined;
};

const slideshowSlugs = [
  'safe', 'pholks', 'nikedp', 'muse', 'lioness-2', 'ourselves',
  'polosxf-2', 'lioness', 'tyga-bops', 'nglh', 'kardashians',
  'anitta-missy-elliott-lobby', 'jhene-aiko-tyga-pop-smoke-sunshine',
  'breeder-lw-bila-bazenga-inaboh', 'kappy-kairetu', 'jefflawgan-tingisa',
  'muhanjii-waiyanza', 'fichua-teaser-2', 'fichua-teaser-1',
];

const Slideshow: React.FC = () => {
  const { projects } = useProjects();

  const slides = slideshowSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null);

  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState<number | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRef = useRef(false);
  const slotRef = useRef<'a' | 'b'>('a');

  const transition = useCallback(
    (toIndex: number) => {
      if (busyRef.current) return;
      busyRef.current = true;

      const fromIndex = current;
      const hiddenSlot = slotRef.current === 'a' ? 'b' : 'a';

      setLeaving(fromIndex);
      setEntering(toIndex);

      setTimeout(() => {
        slotRef.current = hiddenSlot;
        setCurrent(toIndex);
        setEntering(null);
        setLeaving(null);
        busyRef.current = false;
      }, 1200);
    },
    [current]
  );

  const advance = useCallback(() => {
    transition((current + 1) % slides.length);
  }, [current, transition]);

  const goBack = useCallback(() => {
    transition((current - 1 + slides.length) % slides.length);
  }, [current, transition]);

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') advance();
      else if (e.key === 'ArrowLeft') goBack();
    };
    window.addEventListener('keyup', handleKey);
    return () => window.removeEventListener('keyup', handleKey);
  }, [advance, goBack]);

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const currentProject = slides[current] ?? slides[0];
  const isSlotAVisible = slotRef.current === 'a';

  const slotAIndex = isSlotAVisible ? current : entering;
  const slotBIndex = isSlotAVisible ? entering : current;
  const slotAProject = slotAIndex !== null ? (slides[slotAIndex] ?? null) : null;
  const slotBProject = slotBIndex !== null ? (slides[slotBIndex] ?? null) : null;

  return (
    <section className="home-slideshow">
      <div className="home-slideshow-images">
        {/* Slot A */}
        {slotAProject && (
          <div
            className={`home-slide-image ${
              isSlotAVisible && leaving !== null ? 'home-slide-image--leaving' : ''
            } ${!isSlotAVisible && entering !== null ? 'home-slide-image--entering' : ''}`}
          >
            <video
              key={`a-${slotAProject.slug}`}
              src={getSlideshowVideoUrl(slotAProject)}
              poster={getSlideshowPoster(slotAProject)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
        )}

        {/* Slot B */}
        {slotBProject && (
          <div
            className={`home-slide-image ${
              !isSlotAVisible && leaving !== null ? 'home-slide-image--leaving' : ''
            } ${isSlotAVisible && entering !== null ? 'home-slide-image--entering' : ''}`}
          >
            <video
              key={`b-${slotBProject.slug}`}
              src={getSlideshowVideoUrl(slotBProject)}
              poster={getSlideshowPoster(slotBProject)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
        )}

        <Link className="meta" to={`/work/${currentProject.slug}`}>
          <div className="line-1">{currentProject.client}</div>
          <div className="line-2">{currentProject.title}</div>
        </Link>
      </div>

      <div className="arrow left" onClick={goBack}>
        <ArrowLeft />
      </div>
      <div className="arrow right" onClick={advance}>
        <ArrowRight />
      </div>

      <div className="down-arrow bounce" onClick={handleScrollDown}>
        <ArrowDown />
      </div>
    </section>
  );
};

const ArrowLeft: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8L12 16L20 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8L20 16L12 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDown: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M12 20L6 14M12 20L18 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Slideshow;
