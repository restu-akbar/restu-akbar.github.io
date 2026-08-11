import React, { useState } from "react";
import "./Sidebar.css";

import {
    RiHome2Line,
    RiUser3Line,
    RiBriefcase2Line,
    RiStackLine,
    RiChat3Line,
    RiFileList3Line,
    RiMoonLine,
    RiSunLine,
    RiMenu2Line,
} from "react-icons/ri";


const Sidebar = (props) => {
    const [toggle, showMenu] = useState(false);
    const closeMenu = () => showMenu(false);

    return (
        <>
            <aside className={toggle ? "aside show-menu" : "aside"}>
                <a href="#home" className="nav__logo" onClick={closeMenu}>
                    <span className="nav__monogram">RA</span>
                    <span className="nav__brand">Restu Akbar</span>
                </a>

                <nav className="nav">
                    <div className="nav__menu">
                        <ul className="nav__list">
                            <li className="nav__item">
                                <a href="#home" className="nav__link" onClick={closeMenu}>
                                    <RiHome2Line />
                                    <span>Home</span>
                                </a>
                            </li>

                            <li className="nav__item">
                                <a href="#about" className="nav__link" onClick={closeMenu}>
                                    <RiUser3Line />
                                    <span>About</span>
                                </a>
                            </li>

                            <li className="nav__item">
                                <a href="#skills" className="nav__link" onClick={closeMenu}>
                                    <RiFileList3Line />
                                    <span>Skills</span>
                                </a>
                            </li>

                            <li className="nav__item">
                                <a href="#resume" className="nav__link" onClick={closeMenu}>
                                    <RiBriefcase2Line />
                                    <span>Experience</span>
                                </a>
                            </li>

                            <li className="nav__item">
                                <a href="#portfolio" className="nav__link" onClick={closeMenu}>
                                    <RiStackLine />
                                    <span>Projects</span>
                                </a>
                            </li>

                            <li className="nav__item">
                                <a href="#contact" className="nav__link" onClick={closeMenu}>
                                    <RiChat3Line />
                                    <span>Contact</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div className="nav__footer">
                    <button
                        onClick={props.switchTheme}
                        className="nav__link footer__button"
                        aria-label={props.theme === "light" ? "Use dark theme" : "Use light theme"}
                    >
                        {props.theme === 'light' ? <RiMoonLine /> : <RiSunLine />}
                    </button>
                </div>
            </aside>

            <button
                className={toggle ? "nav__toggle nav__toggle-open" : "nav__toggle"}
                onClick={() => showMenu(!toggle)}
                aria-label="Toggle navigation"
                aria-expanded={toggle}
            >
                <RiMenu2Line />
            </button>
        </>
    );
};

export default Sidebar;
