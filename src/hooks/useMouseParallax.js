import { useEffect, useRef } from 'react';

/**
 * useMouseParallax – returns a ref that tracks normalized cursor/gyro movement.
 * The returned ref should be attached to the element you want to move.
 * It provides current normalized x/y values via the ref.current object.
 */
export const useMouseParallax = () => {
  const ref = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / innerHeight) * 2 - 1;
      ref.current = { x, y };
    };

    const handleOrientation = (e) => {
      // gamma = left/right tilt, beta = front/back tilt
      const x = (e.gamma ?? 0) / 45; // approx range -45 to 45
      const y = ((e.beta ?? 0) - 45) / 45; // normalize around 0
      ref.current = { x, y };
    };

    const handleTouch = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const { innerWidth, innerHeight } = window;
      const x = (touch.clientX / innerWidth) * 2 - 1;
      const y = (touch.clientY / innerHeight) * 2 - 1;
      ref.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('touchmove', handleTouch);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, []);

  return ref;
};
