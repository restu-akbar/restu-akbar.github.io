import './Home.css';
import { useContent } from '../../content/ContentContext';

const Home = () => {
    const { hero, name, photo } = useContent().settings;
    const capabilities = hero.capabilities;
    return (
        <section className={photo ? "home container" : "home home--no-photo container"} id="home">
            <div className="home__copy">
                <p className="home__status">
                    <span className="home__dot" /> {hero.status}
                </p>
                <h1 className="home__name">{hero.headline}</h1>
                <p className="home__lead">{hero.lead}</p>
                <div className="home__actions">
                    <a href="#contact" className="btn">Start a conversation</a>
                    <a href="#portfolio" className="btn btn--ghost">See what I&apos;ve shipped</a>
                </div>
            </div>

            {photo && (
                <figure className="home__photo">
                    <img src={photo} alt={name} />
                </figure>
            )}

            <ul className="home__caps" aria-label="What I take on">
                {capabilities.map(({ title, text }) => (
                    <li key={title}>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Home
