import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectAccordionItem from '../components/ProjectAccordionItem';
import InvitationSection from '../components/InvitationSection';

gsap.registerPlugin(ScrollTrigger);

const ProjectsPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [projects, setProjects] = useState([]);
  const firstSectionRef = useRef(null);
  const secondSectionRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/projects.json');
        if (!res.ok) throw new Error(`Failed to fetch projects.json: ${res.status}`);
        const data = await res.json();
        const sanitized = (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          image: p.image && /^https?:\/\//.test(p.image) ? '/images/placeholder.svg' : (p.image || '/images/placeholder.svg'),
        }));
        setProjects(sanitized);
      } catch (err) {
        console.error('Projects JSON load error:', err);
        setProjects([]);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const first = firstSectionRef.current;
    const second = secondSectionRef.current;
    if (!first || !second) return;

    // Simple, lightweight transition cues
    gsap.set(first, { autoAlpha: 1, y: 0 });
    gsap.set(second, { autoAlpha: 0, y: 40 });

    // Replace fade with discrete enter/leave to avoid making last item faint
    ScrollTrigger.create({
      trigger: second,
      start: 'top 80%',
      onEnter: () => gsap.to(first, { opacity: 1, y: 0, duration: 0.2 }),
      onLeaveBack: () => gsap.to(first, { opacity: 1, y: 0, duration: 0.2 })
    });

    // Fade/slide the invitation in
    gsap.fromTo(
      second,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: second,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    // Ensure reveal even when scroll-snap jumps directly to section
    ScrollTrigger.create({
      trigger: second,
      start: 'top 85%',
      onEnter: () => gsap.to(second, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
      onEnterBack: () => gsap.to(second, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(second, { autoAlpha: 0, y: 28, duration: 0.4, ease: 'power2.out' }),
    });

    // Recompute positions after content loads
    ScrollTrigger.refresh();
  }, []);

  // Page entrance animation
  useEffect(() => {
    const first = firstSectionRef.current;
    if (!first) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Subtle overlay fade that creates a cinematic feel
      tl.fromTo('.intro-overlay', { autoAlpha: 0.8 }, { autoAlpha: 0, duration: 0.8 });

      // Bring in the heading
      tl.from('.projects-section h1', { y: 40, opacity: 0, filter: 'blur(6px)', duration: 0.9 }, '-=0.3');

      // Lift the list container
      tl.from('.project-accordion', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4');

      // Stagger reveal for items if present
      tl.from('.project-item', { y: 18, opacity: 0 }, { duration: 0.5, stagger: 0.06 }, '-=0.2');

      // Reveal the next button
      tl.from('.projects-section button', { y: 10, opacity: 0, duration: 0.4 }, '-=0.3');
    }, first);

    return () => ctx.revert();
  }, [projects]);

  const toggleIndex = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Button-triggered transition
  const transitionToInvitation = () => {
    const first = firstSectionRef.current;
    const second = secondSectionRef.current;
    const tl = gsap.timeline();
    tl
      .to(first, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' })
      .add(() => {
        second?.scrollIntoView({ behavior: 'auto', block: 'start' });
      })
      .fromTo(second, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <div className="bg-[#111111] text-white snap-y snap-mandatory">
      {/* Section 1: Projects */}
      <section ref={firstSectionRef} className="projects-section snap-start min-h-screen relative flex flex-col items-center pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-8">
        <div className="intro-overlay absolute inset-0 pointer-events-none bg-gradient-to-b from-black via-black/60 to-transparent" />
        <h1 className="text-left md:text-center w-full font-medium mb-8 md:mb-10" style={{ fontSize: 'clamp(2.5rem, 12vw, 10rem)' }}>
          My Work
        </h1>

        {/* Accordion container with natural page scrolling */}
        <div className="project-accordion group w-full max-w-[1200px] space-y-4 md:space-y-6 hover:[&_.project-item]:opacity-50">
          {projects.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              <p>No projects available right now. Check back soon.</p>
            </div>
          ) : (
            projects.map((project, idx) => (
              <ProjectAccordionItem
                key={idx}
                project={project}
                isActive={activeIndex === idx}
                onToggle={() => toggleIndex(idx)}
                isDimmed={hoveredIndex !== null && hoveredIndex !== idx}
                onHoverEnter={() => setHoveredIndex(idx)}
                onHoverLeave={() => setHoveredIndex(null)}
              />
            ))
          )}
        </div>

        {/* Bottom center scroll-down control */}
        <button
          onClick={transitionToInvitation}
          aria-label="Scroll to invitation"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-zinc-200 px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all"
        >
          Next
        </button>
      </section>

      {/* Section 2: Invitation */}
      <section ref={secondSectionRef} className="projects-invitation-section snap-start min-h-screen">
        <InvitationSection />
      </section>
    </div>
  );
};

export default ProjectsPage;