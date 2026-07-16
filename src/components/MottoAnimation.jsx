import { useEffect, useRef, isValidElement, cloneElement } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Splits `title` into per-word groups of per-letter <span data-letter>
// wrappers for the entrance animation, while preserving any nested inline
// markup (e.g. the mockup's `I like to <i>learn</i> new things.`, the
// italic has to survive the split, not just plain strings). Recurses
// through arrays/fragments/elements and only fans out actual string leaves.
//
// Letters are grouped per WORD (each word wrapped in its own
// `inline-block whitespace-nowrap` span) rather than left as one flat run
// of individually-atomic inline-block letters, browsers treat adjacent
// inline-block boxes as valid line-break points even with no whitespace
// between them, so a flat per-letter split let the browser wrap mid-word
// (confirmed: "learn" broke as "lear" / "n" at 375px). Grouping by word
// keeps each word's letters glued together while still allowing wraps at
// the real (breakable) spaces between words.
function splitIntoLetters(node, keyPrefix = 'l') {
  if (typeof node === 'string') {
    const words = node.split(' ');
    const parts = [];
    words.forEach((word, wi) => {
      if (wi > 0) parts.push(' ');
      if (word.length === 0) return;
      parts.push(
        <span key={`${keyPrefix}-w${wi}`} className="inline-block whitespace-nowrap">
          {word.split('').map((char, ci) => (
            <span
              key={`${keyPrefix}-w${wi}-${ci}`}
              data-letter
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </span>
      );
    });
    return parts;
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => splitIntoLetters(child, `${keyPrefix}-${i}`));
  }
  if (isValidElement(node)) {
    return cloneElement(
      node,
      { key: node.key ?? keyPrefix },
      splitIntoLetters(node.props.children, `${keyPrefix}-c`)
    );
  }
  return node;
}

/**
 * MottoAnimation, the home masthead title + subtitle, animated.
 *
 * The site's one hard animation requirement: "I like to learn new things"
 * promoted from decoration to thesis. Reuses the per-letter randomized
 * offset idea from the now-deleted HeroAnimation.jsx (git history:
 * cad1a51, src/components/HeroAnimation.jsx) but restrained to a one-time
 * entrance, no scroll pin, no scrub, no infinite loop, small amplitude.
 *
 * Usage (HomePage.jsx):
 *
 *   <MottoAnimation
 *     title={<>I like to <i>learn</i> new things.</>}
 *     subtitle={<>Especially the ones that <strong>prove me wrong</strong>.</>}
 *   />
 *
 * Props:
 *   - title (ReactNode, required): rendered as the masthead <h1>, styled to
 *     match the paper title scale (PageTitle "hero" tier: 66px/1.02
 *     line-height, -0.018em tracking, serif weight 400, NOT the old
 *     dark-theme's huge sans-serif hero text). Split into one <span> per
 *     character (via `splitIntoLetters`) so each can be animated
 *     independently, this works for a plain string OR JSX with nested
 *     inline markup (e.g. an <i> around one word, as the mockup uses);
 *     only string leaves are fanned out into letters, element wrappers are
 *     preserved around their own split-up children.
 *   - subtitle (string | ReactNode, optional): rendered below the title
 *     (31px/1.15, serif italic, text-soft), e.g. wrap the emphasized
 *     clause in <strong>, <strong> nested here automatically gets the
 *     mark-colored underline treatment from the mockup (`.sub b`).
 *   - className (string, optional): passthrough on the wrapper div.
 *
 * Behavior:
 *   1. On mount: title letters start at small randomized y/rotation
 *      offsets and settle to rest, chaos resolving into a claim, fast
 *      (~0.5s + a light per-letter stagger), one time only.
 *   2. On scroll into view: the subtitle fades/rises into place,
 *      registered via ScrollTrigger (separate timing from the title).
 *   3. `prefers-reduced-motion: reduce`: both animations are skipped
 *      entirely and everything renders already-settled.
 */
export default function MottoAnimation({ title, subtitle, className = '' }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const letterNodes = titleRef.current
        ? titleRef.current.querySelectorAll('[data-letter]')
        : [];

      if (prefersReducedMotion) {
        gsap.set(letterNodes, { y: 0, rotation: 0, opacity: 1, clearProps: 'transform' });
        gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
        return;
      }

      // 1. Load: letters scatter in from small offsets and settle.
      letterNodes.forEach((letter) => {
        gsap.set(letter, {
          y: 10 + Math.random() * 20, // ~10–30px, a settle, not a drop
          rotation: (Math.random() - 0.5) * 14, // ~±7deg
          opacity: 0,
        });
      });
      gsap.to(letterNodes, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        stagger: { each: 0.012, from: 'start' },
      });

      // 2. Scroll: subtitle clause resolves in, on its own timing.
      if (subtitleRef.current) {
        gsap.set(subtitleRef.current, { opacity: 0, y: 8 });
        gsap.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [title, subtitle]);

  const letters = splitIntoLetters(title);

  return (
    <div ref={rootRef} className={className}>
      <h1
        ref={titleRef}
        className="font-serif font-normal text-[66px] leading-[1.02] tracking-[-0.018em] mb-[10px]"
      >
        {letters}
      </h1>
      {subtitle != null && (
        <div
          ref={subtitleRef}
          className="font-serif italic text-soft text-[31px] leading-[1.15] mb-[30px] [&_strong]:font-normal [&_strong]:not-italic [&_strong]:text-mark [&_strong]:border-b [&_strong]:border-mark"
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}
