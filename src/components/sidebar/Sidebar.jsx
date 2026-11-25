import React, { useState } from "react";
import "./Sidebar.css";

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const links = [
  ["approach", "How I work"],
  ["portfolio", "Projects"],
  ["resume", "Experience"],
  ["about", "About"],
];

const Sidebar = ({ theme, switchTheme }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#home" className="header__name" onClick={close}>
          Restu Akbar
          <span>Forward deployed engineer</span>
        </a>

        <div className="header__tools">
        <button
          className="header__theme"
          onClick={switchTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          className="header__toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
        </div>

        <nav className={open ? "header__nav is-open" : "header__nav"}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={close}>
              {label}
            </a>
          ))}
          <a href="#contact" className="btn header__cta" onClick={close}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
