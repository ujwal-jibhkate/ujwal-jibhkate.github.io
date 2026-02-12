import React, { useState, useRef } from 'react';

// Accordion item that mirrors the HTML spec's behavior and style
const ProjectAccordionItem = ({ project, isActive, onToggle, isDimmed, onHoverEnter, onHoverLeave }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = itemRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const imageUrl = (project.image || '').trim().replace(/`/g, '');
  const [imgSrc, setImgSrc] = useState(imageUrl || '/images/placeholder.svg');

  const onImgError = () => {
    // Fallback to a local neutral placeholder
    setImgSrc('/images/placeholder.svg');
  };

  return (
    <div
      ref={itemRef}
      className={`project-item relative overflow-hidden border-b border-zinc-800 transition-all duration-200 group-hover:opacity-50 hover:!opacity-100`}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      style={{ opacity: isDimmed ? 0.5 : 1 }}
    >
      {/* Radial spotlight overlay */}
      <div
        className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'} hover:opacity-100`}
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, rgba(148,163,184,0.06), transparent 80%)`,
        }}
      />

      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="project-header relative z-10 w-full flex items-center justify-between px-2 md:px-4 py-6 md:py-8 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1 min-w-0">
          <h2 className="m-0 text-[clamp(1.25rem,5vw,3.5rem)] font-light transition-transform duration-400">
            {project.title}
          </h2>
          <span className="category text-xs md:text-sm text-zinc-400 font-light">{project.category}</span>
        </div>
        <span
          className={`indicator relative w-8 h-8 md:w-6 md:h-6 flex-shrink-0 ml-4 transition-transform duration-500 ${isActive ? 'rotate-[135deg]' : ''}`}
        >
          <span className="absolute left-1/2 top-0 w-[2px] h-full bg-sky-500 -translate-x-1/2" />
          <span className="absolute top-1/2 left-0 h-[2px] w-full bg-sky-500 -translate-y-1/2" />
        </span>
      </button>

      {/* Content */}
      <div
        className="project-content relative z-10 overflow-hidden px-2 md:px-4"
        style={{
          maxHeight: isActive ? 1000 : 0,
          paddingBottom: isActive ? '2rem' : 0,
          transition: 'max-height 0.7s cubic-bezier(0.19, 1, 0.22, 1), padding 0.5s ease',
        }}
      >
        <div className="details-card flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
          {/* Text content first on mobile */}
          <div
            className="project-text-content order-1 md:order-2 opacity-0 translate-y-[20px] transition-all duration-600 ease-in-out"
            style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateY(20px)' }}
          >
            <p className="description text-[1.1rem] leading-7 text-zinc-300 m-0 mb-6">
              {project.description}
            </p>
            <div className="meta-section">
              <h3 className="mt-0 font-medium text-zinc-400 mb-3">Technologies & Links</h3>
              <ul className="tech-tags flex flex-wrap gap-2 p-0 list-none m-0 mb-6">
                {(project.tags || []).map((tag, i) => (
                  <li key={i} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </li>
                ))}
              </ul>
              <div className="project-links">
                {(project.links || []).map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sky-500 font-medium mr-4 hover:underline"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Image second on mobile */}
          <img
            src={imgSrc}
            alt={project.alt || project.title}
            onError={onImgError}
            className="project-image order-2 md:order-1 w-full md:w-[320px] h-[200px] object-cover rounded-md opacity-0 translate-x-[-30px] transition-all duration-600 ease-in-out"
            style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'none' : 'translateX(-30px)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectAccordionItem;