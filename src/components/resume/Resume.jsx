import React from "react";
import "./Resume.css";
import { useContent } from "../../content/ContentContext";

const Resume = () => {
  const { experience } = useContent();
  const entries = [...experience].sort((a, b) => b.id - a.id);

  return (
    <section className="resume container section" id="resume">
      <span className="section__eyebrow">Experience</span>
      <h2 className="section__title">Where I&apos;ve worked.</h2>
      <p className="section__intro">
        Roles where I built the features and also ran the infrastructure they
        depend on.
      </p>

      <ol className="jobs">
        {entries.map(({ id, company, yearsActive, title, information, link }) => (
          <li className="job" key={id}>
            <p className="job__years mono">{yearsActive}</p>
            <h3 className="job__title">
              {title},{" "}
              <a className="text-link" href={link} target="_blank" rel="noreferrer">
                {company}
              </a>
            </h3>
            <ul className="job__list">
              {information.map((info, i) => (
                <li key={i}>{info}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Resume;
