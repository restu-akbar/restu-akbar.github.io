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
      <div className="section__heading">
        <span className="section__eyebrow">About</span>
        <h2 className="section__title">Engineering with purpose and ownership.</h2>
        <p className="section__description">
          I enjoy turning real requirements into reliable software and taking
          responsibility across the delivery lifecycle.
        </p>
      </div>

      <div className="about__container grid">
        <div className="about__portrait">
          <img src={Image} alt="Restu Akbar" className="about__img" />
        </div>

        <div className="about__data">
          <div className="about__info">
            <p className="about__description">
              An Informatics Engineering graduate from Politeknik Negeri
              Bandung with hands-on experience building applications from
              planning and development through deployment. My experience comes
              from academic projects, internships, part-time work, and
              independent projects.
            </p>
            <p className="about__description">
              I focus on clean, scalable code, thoughtful system performance,
              and practical delivery. I adapt quickly to new technologies and
              enjoy solving complex technical problems with a clear product
              impact.
            </p>

            <div className="resume-buttons">
              <button
                className="btn btn-id"
                onClick={() => downloadResume("id")}
              >
                Resume — Indonesian
              </button>
              <button
                className="btn btn-en"
                onClick={() => downloadResume("en")}
              >
                Resume — English
              </button>
            </div>
          </div>
        </div>
      </div>

      <AboutBox />
    </section>
  );
};

export default About;
