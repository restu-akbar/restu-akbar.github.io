import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiLink,
  RiGithubLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import "./Portfolio.css";
import Menu from "./Menu";

const sortByIdDesc = (arr) => [...arr].sort((a, b) => b.id - a.id);
const allCategories = [
  "All",
  ...new Set(Menu.flatMap((item) => item.category)),
].sort();

const Portfolio = () => {
  const [items, setItems] = useState(sortByIdDesc(Menu));
  const [activeFilter, setActiveFilter] = useState(0);

  // NEW: state untuk modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const filterItems = (categoryItem) => {
    const updatedItems = Menu.filter((curElem) =>
      curElem.category.includes(categoryItem),
    );
    setItems(sortByIdDesc(updatedItems));
  };

  // NEW: buka modal
  const openModal = (item) => {
    setSelectedItem(item);
    setCurrentSlide(0);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // lock scroll
  };

  // NEW: tutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setCurrentSlide(0);
    document.body.style.overflow = ""; // restore scroll
  };

  // NEW: keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, currentSlide, selectedItem]);

  const nextSlide = () => {
    if (!selectedItem?.gallery?.length) return;
    setCurrentSlide((s) => (s + 1) % selectedItem.gallery.length);
  };
  const prevSlide = () => {
    if (!selectedItem?.gallery?.length) return;
    setCurrentSlide(
      (s) =>
        (s - 1 + selectedItem.gallery.length) % selectedItem.gallery.length,
    );
  };

  return (
    <section className="portfolio container section" id="portfolio">
      <h2 className="section__title">Recent Projects</h2>

      <div className="portfolio__filters">
        {allCategories.map((cat, idx) => (
          <span
            key={idx}
            className={
              activeFilter === idx
                ? "portfolio__item portfolio__item-active"
                : "portfolio__item"
            }
            onClick={() => {
              if (cat === "All") {
                setItems(sortByIdDesc(Menu));
              } else {
                filterItems(cat);
              }
              setActiveFilter(idx);
            }}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="portfolio__container grid">
        {items.map((elem) => {
          const { id, image, title, category, url, repositoryUrl } = elem;

          return (
            <motion.div
              layout
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="portfolio__card"
              key={id}
            >
              <button
                className="portfolio__thumbnail"
                onClick={() => openModal(elem)}
                aria-label={`Lihat galeri untuk ${title}`}
              >
                <img
                  src={image}
                  alt={title}
                  className="portfolio__img"
                  height="267"
                />
                <div className="portfolio__mask"></div>
              </button>

              <span className="portfolio__category">{category.join(", ")}</span>
              <h3 className="portfolio__title">{title}</h3>
              {url ? (
                <>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio__button"
                    aria-label="Buka project"
                  >
                    <RiLink className="portfolio__button-icon" />
                  </a>
                  {repositoryUrl && (
                    <a
                      href={repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="portfolio__github-button"
                      aria-label="Buka repository"
                    >
                      <RiGithubLine className="portfolio__button-icon" />
                    </a>
                  )}
                </>
              ) : repositoryUrl ? (
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="portfolio__button"
                  aria-label="Buka repository"
                >
                  <RiGithubLine className="portfolio__button-icon" />
                </a>
              ) : null}
            </motion.div>
          );
        })}
      </div>

      {/* NEW: Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <ModalGallery
            item={selectedItem}
            currentSlide={currentSlide}
            onClose={closeModal}
            onPrev={prevSlide}
            onNext={nextSlide}
            setSlide={setCurrentSlide}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const ModalGallery = ({
  item,
  currentSlide,
  onClose,
  onPrev,
  onNext,
  setSlide,
}) => {
  const gallery = item.gallery ?? [];

  return (
    <motion.div
      className="modal__backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target.classList.contains("modal__backdrop")) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Galeri untuk ${item.title}`}
    >
      <motion.div
        className="modal__content"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button className="modal__close" onClick={onClose} aria-label="Tutup">
          <RiCloseLine />
        </button>

        <div className="modal__header">
          <h3 className="modal__title">{item.title}</h3>
          {item.category?.length ? (
            <span className="modal__chips">{item.category.join(" • ")}</span>
          ) : null}
        </div>
        {item.description ? (
          <p className="modal__desc">{item.description}</p>
        ) : null}
        {item.contributions?.length > 0 && (
          <div className="modal__contribs">
            <h4>Contributions</h4>
            <ul>
              {item.contributions.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        {item.tech?.length > 0 && (
          <div className="modal__contribs">
            <h4>Tech Stack, Package and Library</h4>
            <ul>
              {item.tech.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        {gallery.length > 0 ? (
          <div className="modal__viewer">
            <button
              className="modal__nav modal__nav--left"
              onClick={onPrev}
              aria-label="Sebelumnya"
            >
              <RiArrowLeftSLine />
            </button>

            <img
              className="modal__image"
              src={gallery[currentSlide]}
              alt={`${item.title} - Gambar ${currentSlide + 1}`}
            />

            <button
              className="modal__nav modal__nav--right"
              onClick={onNext}
              aria-label="Berikutnya"
            >
              <RiArrowRightSLine />
            </button>
          </div>
        ) : (
          <div className="modal__empty">No additional photos yet.</div>
        )}

        {gallery.length > 1 && (
          <div className="modal__thumbs" role="list">
            {gallery.map((src, idx) => (
              <button
                key={idx}
                role="listitem"
                className={`modal__thumb ${
                  idx === currentSlide ? "modal__thumb--active" : ""
                }`}
                onClick={() => setSlide(idx)}
                aria-label={`Lihat gambar ${idx + 1}`}
              >
                <img src={src} alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Portfolio;
