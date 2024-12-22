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
                            Hello! I'm Restu, and I'm based in Bandung, Indonesia. I'm currently studying Software Engineering at Bandung State Polytechnic.<br /><br />
                            Looking back, I can confidently say that this journey has been truly rewarding, and I’m excited to keep growing as a Software Engineer.
                            <br /><br />These days, my primary focus is on enhancing my portfolio by creating more impactful mini-projects to feature here, while continuously learning and evolving as a passionate student.
                            <br />I’m always eager to explore new technologies, tackle challenges, and expand my skill set to make meaningful contributions to the tech world.

                            <br /><br />Here are some of the technologies I’ve been diving into recently:
                        </p>
                        <ul className="about__list">
                            <li>JavaScript (ES6+)</li>
                            <li>Laravel</li>
                            <li>NodeJs</li>
                            <li>ExpressJs</li>
                            <li>PostgreSQL</li>
                            <li>MongoDB</li>
                        </ul>
                        <button className="btn" onClick={downloadResume}>Download CV</button>
                    </div>

                    <div className="about__skills grid">
                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Implementation (Coding)</h3>
                                <span className="skills__number">90%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage development">

                                </span>
                            </div>
                        </div>

                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Design and Documentation</h3>
                                <span className="skills__number">80%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage ui__design">

                                </span>
                            </div>
                        </div>

                        <div className="skills__data">
                            <div className="skills__titles">
                                <h3 className="skills__name">Software Testing</h3>
                                <span className="skills__number">60%</span>
                            </div>

                            <div className="skills__bar">
                                <span className="skills__percentage photography">
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

export default About