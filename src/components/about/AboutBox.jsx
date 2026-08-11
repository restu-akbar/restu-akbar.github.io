import React from 'react'
import { RiFireLine, RiGithubLine, RiStackLine } from 'react-icons/ri';

const AboutBox = () => {
    return (
        <div className="about__boxes grid">
            <div className="about__box">
                <RiFireLine className='about__icon' />

                <div>
                    <h3 className="about__title">3</h3>
                    <span className="about__subtitle">Years of Experience (Academic, Intern, & Part-Time Projects)</span>
                </div>
            </div>

            <div className="about__box">
                <RiGithubLine className='about__icon' />

                <div>
                    <h3 className="about__title">16</h3>
                    <span className="about__subtitle">Github Repositories</span>
                </div>
            </div>

            <div className="about__box">
                <RiStackLine className='about__icon' />

                <div>
                    <h3 className="about__title">8</h3>
                    <span className="about__subtitle">Projects</span>
                </div>
            </div>

        </div>
    )
}

export default AboutBox
