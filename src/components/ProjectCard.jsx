import React, { useState } from 'react';

const ProjectCard = ({ category, title, description, imageUrl, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // Enhanced card container with interactive hover effects
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card relative block bg-[#111111] border border-gray-800 rounded-lg overflow-hidden
                 shadow-lg transition-all duration-500 ease-in-out
                 hover:shadow-sky-500/30 hover:-translate-y-2 hover:scale-[1.02]
                 hover:border-sky-500/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glowing corner accents that appear on hover */}
      <div className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 rounded-tl-lg transition-all duration-300 ${isHovered ? 'border-sky-500 opacity-100' : 'border-transparent opacity-0'}`}></div>
      <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 rounded-br-lg transition-all duration-300 ${isHovered ? 'border-sky-500 opacity-100' : 'border-transparent opacity-0'}`}></div>

      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 md:h-56 object-cover transition-all duration-500 ease-in-out
                  hover:brightness-110"
      />
      <div className="p-4 md:p-6 relative z-10">
        <p className={`text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${isHovered ? 'text-sky-400 translate-x-1' : 'text-sky-600'}`}>{category}</p>
        <h3 className="mt-2 text-xl md:text-2xl font-bold text-white transition-all duration-300 ease-in-out group-hover:text-sky-50">{title}</h3>
        <p className="mt-3 text-gray-400 transition-all duration-300">{description}</p>

        {/* View project button that appears on hover */}
        <div className={`mt-4 text-sky-400 font-medium transition-all duration-300 flex items-center ${isHovered ? 'opacity-100 translate-x-1' : 'opacity-0'}`}>
          View Project
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;