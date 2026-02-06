import React from "react";
import "./About.css";
import Image from "../../assets/profil-2.jpg";
import ResumeID from "../../assets/Restu Akbar-CV-ID.pdf";
import ResumeEN from "../../assets/Restu Akbar-CV-EN.pdf";
import AboutBox from "./AboutBox";

const About = () => {
  const downloadResume = async (lang) => {
    const file = lang === "id" ? ResumeID : ResumeEN;
    window.open(file, "_blank");
  };
  return (
    <section className="about container section" id="about">
      <h2 className="section__title">About Me </h2>

      <div className="about__container grid">
        <img src={Image} alt="" className="about__img" />

        <div className="about__data grid">
          <div className="about__info">
            <p className="about__description">
              Hello! I’m Restu, a Software Engineering student at Politeknik
              Negeri Bandung with a strong focus on applying my knowledge
              directly to real-world projects. Beyond academics, internships,
              and independent projects, I actively work on building impactful
              applications and solutions that reflect industry practices, from
              planning and development to deployment.
              <br />
              <br />
              My focus is on delivering clean, scalable, and efficient code
              while continuously adapting to new technologies and industry best
              practices. I enjoy tackling complex challenges, optimizing
              systems, and contributing to products that create real-world
              impact.
              <br />
              <br />
              Here are some of the technologies I’ve been diving into recently:
            </p>
            <div className="about__list-wrapper">
              {Object.entries(groupedSkills).map(([category, items]) => (
                <ul key={category} className="about__list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="resume-buttons">
              <button
                className="btn btn-id"
                onClick={() => downloadResume("id")}
              >
                Download Resume (ID)
              </button>
              <button
                className="btn btn-en"
                onClick={() => downloadResume("en")}
              >
                Download Resume (EN)
              </button>
            </div>
          </div>

          <div className="about__skills grid">
            <div className="skills__data">
              <div className="skills__titles">
                <h3 className="skills__name">
                  Software Implementation (Coding)
                </h3>
                <span className="skills__number">100%</span>
              </div>

              <div className="skills__bar">
                <span className="skills__percentage hundred"></span>
              </div>
            </div>

            <div className="skills__data">
              <div className="skills__titles">
                <h3 className="skills__name">
                  Software Design and Documentation
                </h3>
                <span className="skills__number">90%</span>
              </div>

              <div className="skills__bar">
                <span className="skills__percentage ninety"></span>
              </div>
            </div>

            <div className="skills__data">
              <div className="skills__titles">
                <h3 className="skills__name">Software Testing</h3>
                <span className="skills__number">80%</span>
              </div>

              <div className="skills__bar">
                <span className="skills__percentage eighty"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AboutBox />
    </section>
  );
};

const skills = [
  { name: "NodeJs", category: "framework" },
  { name: "ExpressJs", category: "framework" },
  { name: "NextJs", category: "framework" },
  { name: "Laravel", category: "framework" },
  { name: "Kotlin (Compose Multiplatform)", category: "framework" },
  { name: "Ktor (Kotlin Server Side)", category: "framework" },
  { name: "Selenium (Python)", category: "framework" },
  { name: "PostgreSQL", category: "database" },
  { name: "MongoDB", category: "database" },
  { name: "MySQL", category: "database" },
  { name: "Redis", category: "database" },
];

const groupedSkills = skills.reduce((acc, skill) => {
  acc[skill.category] = acc[skill.category] || [];
  acc[skill.category].push(skill.name);
  return acc;
}, {});

export default About;
