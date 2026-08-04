import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * useScrollReveal – animate a ref when it enters the viewport.
 * @param {React.RefObject} ref - element to animate
 * @param {object} vars - GSAP vars to override defaults (e.g., { y: 0, opacity: 1 })
 */
export const useScrollReveal = (ref, vars = {}) => {
  useGSAP(() => {
    if (!ref.current) return;
    const defaults = { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' };
    const animation = { ...defaults, ...vars };
    gsap.from(ref.current, {
      ...animation,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
};
