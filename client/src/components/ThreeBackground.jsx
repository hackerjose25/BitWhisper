import React, { useEffect, useRef, useState } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

export default function ThreeBackground({ theme = 'dark' }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const isDark = theme === 'dark';
      
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          
          // Colors
          color: isDark ? 0xf59e0b : 0xd97706,
          color2: isDark ? 0x1e293b : 0x94a3b8,
          backgroundColor: isDark ? 0x090d16 : 0xf8fafc,
          
          points: 18.00,
          maxDistance: 22.00,
          spacing: 18.00,
          
          showDots: true,
          backgroundAlpha: 1.0
        })
      );
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // Update effect when theme changes
  useEffect(() => {
    if (vantaEffect) {
      const isDark = theme === 'dark';
      
      vantaEffect.setOptions({
        color: isDark ? 0xf59e0b : 0xd97706,
        color2: isDark ? 0x1e293b : 0x94a3b8,
        backgroundColor: isDark ? 0x090d16 : 0xf8fafc,
        points: 18.00,
        maxDistance: 22.00,
        spacing: 18.00,
        backgroundAlpha: 1.0
      });
    }
  }, [theme, vantaEffect]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (vantaEffect) {
        vantaEffect.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [vantaEffect]);

  return (
    <div 
      ref={vantaRef} 
      style={{ 
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    />
  );
}
