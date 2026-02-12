import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper function to get random speed
function getRandomSpeed() {
  return 0.8 + Math.random() * 0.7;
}

// LetterDisplay component
const LetterDisplay = ({ word }) => {
  return (
    <>
      {word.split('').map((char, i) => (
        <div
          key={i}
          className="letter text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-[180px] 2xl:text-[220px] font-semibold"
          style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", willChange: 'transform' }}
          data-speed={getRandomSpeed()}
        >
          {char === ' ' ? '\u00A0' : char}
        </div>
      ))}
    </>
  );
};

// Helper function to get random rotation
function getRandomRotation() {
  return Math.random() * 60 - 30;
}

// Animation function
function animateLettersOnScroll(ref) {
  const nodes = ref.current?.querySelectorAll('.letter') || [];
  const amplitude = window.innerHeight * 0.85;
  nodes.forEach(letter => {
    const speed = parseFloat(letter.dataset.speed || '1');
    const yTarget = (1 - speed) * amplitude;
    gsap.to(letter, {
      y: yTarget,
      rotation: getRandomRotation(),
      ease: 'power2.out',
      duration: 0.8,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: '+=120%',
        scrub: 1,
        invalidateOnRefresh: true,
        onLeave: () => gsap.set(letter, { y: yTarget, opacity: 0 }),
        onEnterBack: () => gsap.set(letter, { y: 0, opacity: 1 })
      }
    });
  });
}

const HeroAnimation = () => {
  const ref = useRef(null);

  useEffect(() => {
    let ctx;
    let pinTrigger;
    let visibilityTrigger;
    const timer = setTimeout(() => {
      if (!ref.current) return;
      ctx = gsap.context(() => {
        animateLettersOnScroll(ref);
      }, ref);

      // Pin the hero briefly to maximize visibility while the effect runs
      pinTrigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      });

      // Hide the hero entirely once it leaves its pin range
      visibilityTrigger = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: '+=120%',
        onEnter: () => gsap.set(ref.current, { autoAlpha: 1 }),
        onLeave: () => gsap.set(ref.current, { autoAlpha: 0 }),
        onEnterBack: () => gsap.set(ref.current, { autoAlpha: 1 })
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      pinTrigger?.kill();
      visibilityTrigger?.kill();
      ctx?.revert();
    };
  }, []);


  return (
    <div ref={ref} className="ml-4 md:ml-8 scroll-smooth relative h-full overflow-hidden pointer-events-none">
      <div className="-mt-16 md:-mt-28 mb-20 md:mb-36 lg:mb-24 flex h-screen flex-col justify-end">
        <div className="flex flex-wrap">
          <LetterDisplay word="I like to Learn" />
        </div>
        <div className="flex flex-wrap">
          <LetterDisplay word="New Things" />
        </div>
      </div>
      <div className="flex flex-wrap">
        <LetterDisplay word="Creative" />
        <div className="w-2 sm:w-4 md:w-10" />
        <LetterDisplay word="Innovative" />
        <div className="w-2 sm:w-4 md:w-10" />
        <LetterDisplay word="Curious" />
      </div>
    </div>
  );
};

export default HeroAnimation;