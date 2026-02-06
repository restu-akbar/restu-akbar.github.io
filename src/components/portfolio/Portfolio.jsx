import { useState, useCallback, useEffect } from "react";
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
  const [filterKey, setFilterKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const MAX_ITEMS = 9;
  const itemsToShow = showAll ? items : items.slice(0, MAX_ITEMS);

  const filterItems = (categoryItem) => {
    const updatedItems = Menu.filter((curElem) =>
      curElem.category.includes(categoryItem),
    );
    setItems(sortByIdDesc(updatedItems));
    setFilterKey((prev) => prev + 1);
  };

  const openModal = useCallback((item) => {
    setSelectedItem(item);
    setCurrentSlide(0);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setCurrentSlide(0);
    document.body.style.overflow = "";
  }, []);

  const galleryLen = selectedItem?.gallery?.length ?? 0;

  const nextSlide = useCallback(() => {
    if (galleryLen === 0) return;
    setCurrentSlide((s) => (s + 1) % galleryLen);
  }, [galleryLen]);

  const prevSlide = useCallback(() => {
    if (galleryLen === 0) return;
    setCurrentSlide((s) => (s - 1 + galleryLen) % galleryLen);
  }, [galleryLen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, nextSlide, prevSlide, closeModal]);

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
              setShowAll(false);
              if (cat === "All") {
                setItems(sortByIdDesc(Menu));
                setFilterKey((prev) => prev + 1);
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
        <AnimatePresence mode="wait">
          {itemsToShow.map((elem) => {
            const { id, image, title, category, url, repositoryUrl } = elem;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="portfolio__card"
                key={`${filterKey}-${id}`}
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

                <span className="portfolio__category">
                  {category.join(", ")}
                </span>
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
        </AnimatePresence>
      </div>
      {items.length > MAX_ITEMS && !showAll && (
        <div className="portfolio__more">
          <button
            className="portfolio__more-btn"
            onClick={() => setShowAll(true)}
          >
            View all projects
          </button>
        </div>
      )}

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
  const [direction, setDirection] = useState(0);
  const handleNext = () => {
    setDirection(1);
    onNext();
  };

  const handlePrev = () => {
    setDirection(-1);
    onPrev();
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

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

        {item.url ? (
          <div className="modal__contribs">
            <h4>Project Url</h4>
            <a
              className="modal__desc link-text"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>
          </div>
        ) : null}

        {gallery.length > 0 ? (
          <div className="modal__viewer">
            <button
              className="modal__nav modal__nav--left"
              onClick={handlePrev}
              aria-label="Sebelumnya"
            >
              <RiArrowLeftSLine />
            </button>

            <AnimatePresence custom={direction} mode="wait">
              <motion.img
                key={currentSlide}
                className="modal__image"
                src={gallery[currentSlide]}
                alt={`${item.title} - Gambar ${currentSlide + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </AnimatePresence>

            <button
              className="modal__nav modal__nav--right"
              onClick={handleNext}
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
