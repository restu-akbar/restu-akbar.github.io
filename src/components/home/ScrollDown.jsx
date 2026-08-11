import React from 'react'

const ScrollDown = () => {
    return (
        <div className="scroll__down" aria-hidden="true">
            <a href="#about" className="mouse__wrapper" tabIndex="-1">
                <span className="mouse"><span className="wheel" /></span>
                <span className="home__scroll-name">Explore</span>
            </a>
        </div>
    )
}

export default ScrollDown
