import React, { useState } from "react";
import "./Sidebar.css";

const links = [
  ["approach", "How I work"],
  ["portfolio", "Work"],
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

        <button
          className="header__toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={open ? "header__nav is-open" : "header__nav"}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={close}>
              {label}
            </a>
          ))}
          <button
            className="header__theme"
            onClick={switchTheme}
            aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <a href="#contact" className="btn header__cta" onClick={close}>
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Sidebar;
