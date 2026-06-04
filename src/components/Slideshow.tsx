import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/AdminContext';
import './Slideshow.css';

const INTERVAL_MS = 5000;

const slideshowSlugs = [
  'safe', 'pholks', 'nikedp', 'muse', 'lioness-2', 'ourselves',
  'polosxf-2', 'lioness', 'tyga-bops', 'nglh', 'kardashians',
  'anitta-missy-elliott-lobby', 'jhene-aiko-tyga-pop-smoke-sunshine',
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

  // Refs for the two video slots
  const videoARef = useRef<HTMLVideoElement>(null); // slot A
  const videoBRef = useRef<HTMLVideoElement>(null); // slot B
  const slotRef = useRef<'a' | 'b'>('a'); // which slot is currently visible

  const transition = useCallback(
    (toIndex: number) => {
      if (busyRef.current) return;
      busyRef.current = true;

      const fromIndex = current;
      const visibleSlot = slotRef.current;
      const hiddenSlot = visibleSlot === 'a' ? 'b' : 'a';

      // Set the hidden slot's video to the next slide and start playing
      const hiddenVideo = hiddenSlot === 'a' ? videoARef.current : videoBRef.current;
      if (hiddenVideo) {
        hiddenVideo.src = slides[toIndex].videoUrl;
        hiddenVideo.currentTime = 0;
      }

      // Start crossfade — CSS handles the opacity animation
      setLeaving(fromIndex);
      setEntering(toIndex);

      // After CSS transition completes, clean up
      setTimeout(() => {
        // Pause the old video
        const oldVideo = visibleSlot === 'a' ? videoARef.current : videoBRef.current;
        if (oldVideo) oldVideo.pause();

        // Hidden slot is now visible
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

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  // Keyboard
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

  // Determine which project each slot shows
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
              ref={videoARef}
              src={slotAProject.videoUrl}
              autoPlay
              muted
              loop
              playsInline
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
              ref={videoBRef}
              src={slotBProject.videoUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        )}

        {/* Meta — always shows the current project */}
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
