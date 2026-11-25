import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import "./Portfolio.css";
import { useContent } from "../../content/ContentContext";

const sortByIdDesc = (arr) => [...arr].sort((a, b) => b.id - a.id);

const Portfolio = () => {
  const { projects } = useContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const allCategories = useMemo(
    () => ["All", ...new Set(projects.flatMap((p) => p.category))].sort(),
    [projects],
  );
  const items = useMemo(
    () =>
      sortByIdDesc(
        activeCategory === "All"
          ? projects
          : projects.filter((p) => p.category.includes(activeCategory)),
      ),
    [projects, activeCategory],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const MAX_ITEMS = 9;
  const itemsToShow = showAll ? items : items.slice(0, MAX_ITEMS);

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
      <span className="section__eyebrow">Selected work</span>
      <h2 className="section__title">Systems I&apos;ve built and shipped.</h2>
      <p className="section__intro">
        Web, mobile and backend projects for campuses and companies, some live
        today. Open any project for the stack and screenshots.
      </p>

      <div className="portfolio__main">
        <div className="portfolio__filters mono">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={
                activeCategory === cat
                  ? "portfolio__item portfolio__item-active"
                  : "portfolio__item"
              }
              aria-pressed={activeCategory === cat}
              onClick={() => {
                setShowAll(false);
                setActiveCategory(cat);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="portfolio__list">
          {itemsToShow.map((elem) => {
            const { id, title, category, url, repositoryUrl, image } = elem;
            return (
              <li className="project" key={id}>
                <button
                  className="project__open"
                  onClick={() => openModal(elem)}
                  aria-label={`Details for ${title}`}
                >
                  <img className="project__thumb" src={image} alt="" loading="lazy" />
                  <span className="project__title">{title}</span>
                </button>
                <div className="project__foot">
                  <span className="project__tags">
                    {category.map((c) => (
                      <span className="tag" key={c}>{c}</span>
                    ))}
                  </span>
                  <span className="project__links mono">
                    {url && (
                      <a className="text-link" href={url} target="_blank" rel="noreferrer">live</a>
                    )}
                    {repositoryUrl && (
                      <a className="text-link" href={repositoryUrl} target="_blank" rel="noreferrer">code</a>
                    )}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {items.length > MAX_ITEMS && !showAll && (
          <button className="btn portfolio__more" onClick={() => setShowAll(true)}>
            Show all {items.length} projects
          </button>
        )}
      </div>

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
            <ul className="modal__tech-list">
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
              className="modal__desc text-link"
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
