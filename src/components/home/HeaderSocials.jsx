import React from "react";
import { FaGithub, FaLinkedinIn, FaGitlab } from "react-icons/fa";

const HeaderSocials = () => {
  return (
    <div className="home__socials">
      <a
        href="https://www.github.com/restu-akbar"
        className="home__social-link"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub />
      </a>

      <a
        href="https://www.linkedin.com/in/restuakbar"
        className="home__social-link"
        target="_blank"
        rel="noreferrer"
      >
        <FaLinkedinIn />
      </a>
      <a
        href="https://www.gitlab.com/akbarst3"
        className="home__social-link"
        target="_blank"
        rel="noreferrer"
      >
        <FaGitlab />
      </a>
    </div>
  );
};

export default HeaderSocials;

