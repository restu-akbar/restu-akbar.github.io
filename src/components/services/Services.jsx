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
    title: "Database Design & Optimization",
    description:
      "Designing and optimizing databases to meet user requirements while ensuring fast and efficient query performance.",
  },
  {
    id: 4,
    image: Image4,
    title: "DevOps & Server Management",
    description:
      "Automating deployment processes with CI/CD pipelines, managing cloud and on-premise servers.",
  },
];

const Services = () => {
  return (
    <section className="services container section" id="services">
      <h2 className="section__title">Skills</h2>

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
    </section>
  );
};

export default Services;

