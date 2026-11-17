import React from "react";
import "./Services.css";
import { useContent } from "../../content/ContentContext";

const Services = () => {
  const { skills: technologies, settings } = useContent();
  const { steps } = settings.approach;

  return (
  <section className="services container section" id="approach">
    <span className="section__eyebrow">01 · How I work</span>
    <h2 className="section__title">{settings.approach.title}</h2>
    <p className="section__intro">{settings.approach.intro}</p>

    <ol className="steps">
      {steps.map(({ title, text }, i) => (
        <li className="step" key={title}>
          <span className="step__num mono">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>

    <h3 className="stack__title">What I work with</h3>
    <dl className="skills">
      {technologies.map(({ title, items }) => (
        <div className="skills__row" key={title}>
          <dt className="mono">{title}</dt>
          <dd>{items.map((i) => (<span className="tag" key={i}>{i}</span>))}</dd>
        </div>
      ))}
    </dl>
  </section>
  );
};

export default Services;
