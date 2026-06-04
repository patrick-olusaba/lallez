import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { projects } from './data/projects';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/* ── Preloader: wait until slideshow content is ready ─────────────────────────── */

const isCloudinaryEmbed = (url: string) =>
  url.includes('player.cloudinary.com/embed');

/** Build a direct video URL for preloading, with optimisation params. */
const buildVideoUrl = (videoUrl: string, embedUrl?: string): string | null => {
  // Vimeo / direct URL
  if (videoUrl && !isCloudinaryEmbed(videoUrl)) return videoUrl;
  // Derive from embedUrl or Cloudinary videoUrl
  const derive = (url: string) => {
    try {
      const u = new URL(url);
      const cn = u.searchParams.get('cloud_name');
      const pid = u.searchParams.get('public_id');
      if (cn && pid) return `https://res.cloudinary.com/${cn}/video/upload/q_auto:good,w_1920/${pid}.mp4`;
    } catch { /* ignore */ }
    return null;
  };
  if (embedUrl) return derive(embedUrl);
  if (isCloudinaryEmbed(videoUrl)) return derive(videoUrl);
  return null;
};

/** Build a poster URL for preloading. */
const buildPosterUrl = (thumbnailUrl?: string, embedUrl?: string, videoUrl?: string): string | null => {
  if (thumbnailUrl) return thumbnailUrl;
  const derive = (url: string) => {
    try {
      const u = new URL(url);
      const cn = u.searchParams.get('cloud_name');
      const pid = u.searchParams.get('public_id');
      if (cn && pid) return `https://res.cloudinary.com/${cn}/video/upload/so_0/${pid}.jpg`;
    } catch { /* ignore */ }
    return null;
  };
  if (embedUrl) return derive(embedUrl);
  if (videoUrl && isCloudinaryEmbed(videoUrl)) return derive(videoUrl);
  return null;
};

// First few slides to preload (the rest load in the background)
const PRELOAD_COUNT = 4;
const slideshowSlugs = [
  'safe', 'pholks', 'nikedp', 'muse', 'lioness-2', 'ourselves',
  'polosxf-2', 'lioness', 'tyga-bops', 'nglh', 'kardashians',
  'anitta-missy-elliott-lobby', 'jhene-aiko-tyga-pop-smoke-sunshine',
  'breeder-lw-bila-bazenga-inaboh', 'kappy-kairetu', 'jefflawgan-tingisa',
  'muhanjii-waiyanza', 'fichua-teaser-2', 'fichua-teaser-1',
];

const slideshowProjects = slideshowSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => p != null);

const preloadSlides = slideshowProjects.slice(0, PRELOAD_COUNT);

// Minimum time to show preloader (ms) — ensures it's visible long enough
const MIN_PRELOADER_TIME = 2500;

function hidePreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;
  el.classList.add('fade-out');
  setTimeout(() => el.remove(), 600);
}

function startPreloading() {
  const startTime = Date.now();
  let loadedCount = 0;
  const targetCount = preloadSlides.length;

  if (targetCount === 0) {
    // No slides to preload — wait minimum time then hide
    setTimeout(hidePreloader, MIN_PRELOADER_TIME);
    return;
  }

  const onOneReady = () => {
    loadedCount++;
    if (loadedCount >= targetCount) {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_PRELOADER_TIME - elapsed);
      setTimeout(hidePreloader, remaining);
    }
  };

  // Preload posters first (they're tiny and load instantly)
  preloadSlides.forEach((p) => {
    const poster = buildPosterUrl(p.thumbnailUrl, p.embedUrl, p.videoUrl);
    if (poster) {
      const img = new Image();
      img.onload = img.onerror = () => {}; // don't count posters toward completion
      img.src = poster;
    }
  });

  // Preload the first few videos
  preloadSlides.forEach((p) => {
    const url = buildVideoUrl(p.videoUrl, p.embedUrl);
    if (!url) {
      onOneReady(); // nothing to preload, count as done
      return;
    }
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.style.display = 'none';
    video.src = url;
    video.onloadeddata = () => onOneReady();
    video.onerror = () => onOneReady(); // don't block on errors
    document.body.appendChild(video);

    // Safety timeout: if a video takes >15s, move on
    setTimeout(() => onOneReady(), 15000);
  });
}

// Kick off preloading immediately
startPreloading();
