import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 md:py-8 px-4 md:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0 text-center md:text-left">
          {/* Left - Name */}
          <div className="text-left md:text-left w-full md:w-auto">
            <p className="text-base md:text-lg font-semibold text-white">Ujwal Jibhkate</p>
          </div>

          {/* Middle - Title */}
          <div className="text-center w-full md:w-auto">
            <p className="text-sm text-white/70">AI/ML Engineer</p>
          </div>

          {/* Right - Acknowledgement */}
          <div className="text-left md:text-right w-full md:w-auto">
            <p className="text-xs md:text-sm text-white/70">
              This website design is inspired by{' '}
              <a
                href="https://www.linkedin.com/in/bettina-sosa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white/80 underline transition-colors duration-300"
              >
                Bettina Sosa
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
