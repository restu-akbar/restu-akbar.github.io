import './Home.css';
import Me from '../../assets/profil.png';
import HeaderSocials from './HeaderSocials';
import ScrollDown from './ScrollDown';

const Home = () => {
    return (
        <section className="home container" id='home'>
            <div className="intro grid">
                <div className="home__content">
                    <span className="home__eyebrow">Hello, I&apos;m Restu Akbar</span>
                    <h1 className="home__name">Software Engineer building dependable digital products.</h1>
                    <p className="home__description">
                        I build applications end-to-end—from clean interfaces and
                        RESTful APIs to automated deployment and server operations.
                    </p>
                    <div className="home__focus" aria-label="Areas of focus">
                        <span>Backend Development</span>
                        <span>DevOps</span>
                        <span>System Administration</span>
                    </div>
                    <div className="home__actions">
                        <a href="#portfolio" className="btn">View Projects</a>
                        <a href="#contact" className="btn btn--secondary">Contact Me</a>
                    </div>
                    <HeaderSocials />
                </div>

                <div className="home__visual" aria-label="Restu Akbar profile photo">
                    <div className="home__image-frame">
                        <img src={Me} alt="Restu Akbar" className='home__img' />
                    </div>
                    <div className="home__status">
                        <span className="home__status-dot" />
                        Software Engineer
                    </div>
                </div>
            </div>

            <ScrollDown />
        </section>
    )
}

export default Home
