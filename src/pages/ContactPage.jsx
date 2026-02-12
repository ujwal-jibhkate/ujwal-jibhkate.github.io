import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import ContactLink from '../components/ContactLink';
import ContactForm from '../components/ContactForm';

// Your contact information
const contactData = [
  { title: "Email", href: "mailto:ujwaljibhkate06@gmail.com" },
  { title: "LinkedIn", href: "http://www.linkedin.com/in/ujwal-jibhkate" },
  { title: "GitHub", href: "https://github.com/ujwal-jibhkate" },
  // Add more links here if you like
];

const ContactPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Animate the links sliding in from the bottom with a stagger effect
    const ctx = gsap.context(() => {
      gsap.from('.contact-link', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2, // Animate each link 0.2s after the previous one
        delay: 0.3,
      });
      gsap.from('.contact-form', {
        y: 80,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen bg-black flex flex-col items-center justify-center pt-32 pb-8 px-8 overflow-hidden">

      <div className="text-center mb-16">
        <p className="text-xl text-gray-400">Have a project in mind or just want to connect?</p>
        <h1 className="text-6xl md:text-7xl font-bold text-white mt-2">Get in Touch.</h1>
      </div>

      {/* The 'group' class on this container enables the hover effect in the child links */}
      <div className="w-full max-w-4xl space-y-4">
        {contactData.map((item) => (
          <ContactLink key={item.title} title={item.title} href={item.href} />
        ))}
      </div>

      <div className="w-full max-w-2xl mt-12 contact-form">
        <ContactForm />
      </div>



    </section>
  );
};

export default ContactPage;