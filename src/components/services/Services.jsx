import React from "react";
import "./Services.css";
import Image1 from "../../assets/service-1.svg";
import Image2 from "../../assets/service-2.svg";
import Image3 from "../../assets/service-3.svg";
import Image4 from "../../assets/service-4.svg";

const data = [
  {
    id: 1,
    image: Image1,
    title: "Web Development",
    description:
      "Building and maintaining websites that follow industry standards, ensuring performance, scalability, and security.",
  },
  {
    id: 2,
    image: Image2,
    title: "Mobile Development",
    description:
      "Developing and maintaining mobile applications with clean architecture and seamless performance across devices.",
  },
  {
    id: 3,
    image: Image3,
    title: "Automated Testing",
    description:
      "Automating web application testing using Selenium for faster, reliable, and repeatable test execution.",
  },
  {
    id: 4,
    image: Image4,
    title: "DevOps & Server Management",
    description:
      "Automating deployment processes with CI/CD pipelines, managing cloud and on-premise servers.",
  },
];

const technologies = [
  {
    title: "Frameworks & application",
    items: ["Vue.js", "Next.js", "Spring Boot", "Node.js", "Laravel", "Kotlin", "Ktor", "Selenium"],
  },
  {
    title: "Infrastructure & delivery",
    items: ["Proxmox", "Docker", "Microsoft Azure", "Debian Server", "Nginx", "CI/CD"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"],
  },
];

const Services = () => {
  return (
    <section className="services container section" id="skills">
      <div className="section__heading">
        <span className="section__eyebrow">Skills</span>
        <h2 className="section__title">From interface to infrastructure.</h2>
        <p className="section__description">
          Practical experience across product development, quality, deployment,
          and day-to-day server operations.
        </p>
      </div>

      <div className="services__container grid">
        {data.map(({ id, image, title, description }) => {
          return (
            <div className="services__card" key={id}>
              <img
                src={image}
                alt={title}
                className="services__img"
                width="80"
              />

              <h3 className="services__title">{title}</h3>
              <p className="services__description">{description}</p>
            </div>
          );
        })}
      </div>

      <div className="technology__grid grid">
        {technologies.map(({ title, items }) => (
          <div className="technology__group" key={title}>
            <h3>{title}</h3>
            <div className="technology__list">
              {items.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
