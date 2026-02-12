import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import profilePicture from '../assets/profile.jpg';

const AboutPreview = () => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleAboutClick = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const clone = button.cloneNode(true);

    clone.style.position = 'fixed';
    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.margin = '0';
    clone.style.zIndex = '50';
    clone.style.backgroundColor = '#0ea5e9';

    const swipeLayer = clone.querySelector('div');
    if (swipeLayer) {
      swipeLayer.remove();
    }

    document.body.appendChild(clone);
    gsap.set(button, { opacity: 0 });

    gsap.to(clone, {
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: () => {
        navigate('/about');

        setTimeout(() => {
          document.body.removeChild(clone);
          gsap.set(button, { opacity: 1 });
        }, 100);
      }
    });
  };

  return (
    <section className="min-h-screen bg-white text-black flex items-center justify-center py-16 md:py-0">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex justify-center">
            <div className="w-48 h-48 md:w-80 md:h-80 bg-gray-200 rounded-full flex items-center justify-center">
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
          <div className="text-left">
            <p className="text-base md:text-xl text-gray-700 leading-relaxed">
              "I like to learn new things." As a self-described epistemophile, this is the simple motto that fuels my work as a software engineer. My focus is on the complete lifecycle of an AI application—from training a deep learning model in PyTorch to containerizing it with Docker and deploying...
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                ref={buttonRef}
                onClick={handleAboutClick}
                className="relative overflow-hidden bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
              >
                <div className="absolute inset-0 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full"></div>
                <span className="relative">Learn More About Me</span>
              </button>
              <button
                onClick={() => {
                  console.log('Projects button clicked');
                  navigate('/projects');
                }}
                className="bg-black hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
              >
                View My Work
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;