import React from 'react';
import './Contact.css';

interface Rep {
  name: string;
  email: string;
  phone?: string;
}

const DIRECT_LINKS = [
  { label: 'Email', href: 'mailto:info@arradr.com' },
  { label: 'Instagram', href: 'https://www.instagram.com/arrad/' },
  { label: 'Vimeo', href: 'https://vimeo.com/arrad' },
];

const SOCIAL_ICONS = [
  {
    label: 'Email',
    href: 'mailto:info@arradr.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13L2 4" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/arrad/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Vimeo',
    href: 'https://vimeo.com/arrad',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 6.5C21.5 7.5 19.5 14 17 16.5C14.5 19 12.5 18 11.5 15C10.5 12 9.5 8 8 6C6.5 4 5 5 4 6.5L2 8C3.5 6.5 5.5 4.5 7 5C8.5 5.5 10 10 11 14C12 18 13.5 20.5 16 18C18.5 15.5 20.5 9 21 7.5C21.5 6 22.5 5.5 22 6.5Z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@arrad',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@arrad',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

const REPS: { region: string; agency: string; people: Rep[] }[] = [
  {
    region: 'West Coast',
    agency: 'Shortlist',
    people: [
      { name: 'Charlie McBrearty', email: 'charlie@shortlistmgmt.com' },
      { name: "Kelly O'Neill", email: 'kelly@shortlistmgmt.com' },
    ],
  },
  {
    region: 'Midwest',
    agency: 'Sharron & Perry',
    people: [
      { name: 'Sharon Swanson', email: 'sharon@sharonandperry.com' },
      { name: 'Perry Tongate', email: 'perry@sharonandperry.com' },
    ],
  },
  {
    region: 'East Coast',
    agency: 'Moustache',
    people: [
      { name: 'Jared Shapiro', email: 'jared@moustache.nyc' },
    ],
  },
  {
    region: 'Asia',
    agency: 'Go East Creative Management',
    people: [
      { name: 'Anna Konyaeva', email: 'all@goeast.tv', phone: '+971 54 776 1587' },
      { name: 'Zara Arakelyan', email: 'all@goeast.tv', phone: '+7 916 616 2028' },
    ],
  },
];

const Contact: React.FC = () => {
  return (
    <main className="page-contact">
      {/* Hero area */}
      <div className="contact-hero">
        <h1>Let's make<br />something.</h1>
        <p className="contact-tagline">
          Director / Writer — available for commissions,<br />
          commercial work, and music videos worldwide.
        </p>
      </div>

      <div className="contact-layout">
        {/* Left column — Direct + Social */}
        <aside className="contact-sidebar">
          <div className="contact-card contact-card--direct">
            <h2 className="contact-label">Get in touch</h2>
            <ul className="contact-direct">
              {DIRECT_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label} <span className="arrow">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-card">
            <h2 className="contact-label">Music Videos</h2>
            <a href="mailto:tommylabuda@me.com" className="contact-link">
              Tommy Labuda <span className="arrow">→</span>
            </a>
          </div>

          <div className="contact-card">
            <h2 className="contact-label">Production</h2>
            <p className="contact-sub">Direct</p>
            <a href="mailto:info@arradr.com" className="contact-link">
              Contact Here <span className="arrow">→</span>
            </a>
          </div>

          <div className="contact-card">
            <h2 className="contact-label">Follow</h2>
            <div className="contact-socials">
              {SOCIAL_ICONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  className="contact-social-link"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Right column — Commercial reps */}
        <section className="contact-main">
          <h2 className="contact-section-title">Commercial + Branded</h2>
          <div className="reps-grid">
            {REPS.map((rep) => (
              <div key={rep.region} className="rep-card">
                <h3 className="rep-region">{rep.region}</h3>
                <p className="rep-agency">{rep.agency}</p>
                <ul className="rep-list">
                  {rep.people.map((person) => (
                    <li key={person.name} className="rep-item">
                      <a href={`mailto:${person.email}`} className="rep-name">
                        {person.name}
                      </a>
                      {person.phone && (
                        <span className="rep-phone">{person.phone}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Contact;
