import React from 'react';
import './About.css';
import Image from '../../assets/profil-2.jpg';
import Resume from '../../assets/Restu Akbar-CV.pdf';
import AboutBox from './AboutBox';

const About = () => {
    const downloadResume = async () => {
        window.open(Resume, '_blank');
    }
    return (
        <section className="about container section" id="about">
            <h2 className="section__title">About Me </h2>

            <div className="about__container grid">
                <img src={Image} alt="" className='about__img' />

                <div className="about__data grid">
                    <div className="about__info">
                        <p className="about__description">
                            Hello! I'm Restu, and I'm based in Bandung, Indonesia. I'm currently studying Software Engineering at Politeknik Negeri Bandung.<br /><br />These days, my primary focus is on enhancing my portfolio by creating more impactful projects to feature here, while continuously learning and evolving as a passionate student.
                            <br />I’m always eager to explore new technologies, tackle challenges, and expand my skill set to make meaningful contributions to the tech world.

                            <br /><br />Here are some of the technologies I’ve been diving into recently:
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


                        <button className="btn" onClick={downloadResume}>Download CV</button>
                    </div>

                    <div className="about__skills grid">
                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Implementation (Coding)</h3>
                                <span className="skills__number">100%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage full">

                                </span>
                            </div>
                        </div>

                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Design and Documentation</h3>
                                <span className="skills__number">90%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage development">

                                </span>
                            </div>
                        </div>

                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Testing</h3>
                                <span className="skills__number">60%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage so__so">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AboutBox />
        </section>
    )
}

const skills = [
    { name: "JavaScript", category: "language" },
    { name: "TypeScript", category: "language" },
    { name: "Kotlin", category: "language" },
    { name: "NodeJs", category: "framework" },
    { name: "ExpressJs", category: "framework" },
    { name: "NestJs", category: "framework" },
    { name: "Laravel", category: "framework" },
    { name: "Ktor (Kotlin Server Side)", category: "framework" },
    { name: "PostgreSQL", category: "database" },
    { name: "MongoDB", category: "database" },
    { name: "MySQL", category: "database" },
];

const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill.name);
    return acc;
}, {});



export default About