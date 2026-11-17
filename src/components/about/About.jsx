import React from "react";
import "./About.css";
import { useContent } from "../../content/ContentContext";

const DocIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const CV_LANGUAGES = [
  ["en", "English"],
  ["id", "Bahasa Indonesia"],
];

const About = () => {
  const { settings } = useContent();
  const cvs = CV_LANGUAGES.filter(([key]) => settings.cv?.[key]);

  return (
    <section className="about container section" id="about">
      <span className="section__eyebrow">04 · About</span>
      <h2 className="section__title">A bit about me.</h2>

      <div className="about__body">
        <div className="about__text">
          {settings.about.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        {cvs.length > 0 && (
          <aside className="cv" aria-label="Resume">
            <div className="cv__head">
              <span className="cv__icon"><DocIcon /></span>
              <div>
                <h3>Resume</h3>
                <p>Roles, projects and skills in one document.</p>
              </div>
            </div>
            <ul className="cv__list">
              {cvs.map(([key, label]) => (
                <li key={key}>
                  <a className="cv__link" href={settings.cv[key]} target="_blank" rel="noreferrer">
                    <span className="cv__lang">{label}</span>
                    <span className="cv__meta mono">PDF</span>
                    <span className="cv__dl"><DownloadIcon /></span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </section>
  );
};

export default About;
