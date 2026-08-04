import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Full‑screen preloader that fades out once the app is ready.
 * It uses the premium palette – background #080808 and gold accent.
 */
const Preloader = () => {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 0, duration: 1.2, delay: 0.5 }
    )
      .fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8 },
        '-=0.8'
      );
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-car-bg flex items-center justify-center z-50"
    >
      <div ref={logoRef} className="text-4xl font-bold text-car-gold">
        Atlas Autos
      </div>
    </div>
  );
};

export default Preloader;
