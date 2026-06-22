import React, { useEffect, useRef } from 'react';

export function InkBlotsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    interface Blot {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      points: { r: number; a: number }[];
    }

    let blots: Blot[] = [];

    const handleClick = (e: MouseEvent) => {
      const points = [];
      const numPoints = 8 + Math.random() * 8;
      for (let i = 0; i < numPoints; i++) {
        points.push({
          a: (Math.PI * 2 * i) / numPoints,
          r: 0.5 + Math.random() * 0.5
        });
      }

      blots.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10 + Math.random() * 20,
        alpha: 0.4 + Math.random() * 0.3,
        points
      });
    };

    window.addEventListener('click', handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = blots.length - 1; i >= 0; i--) {
        const blot = blots[i];
        
        ctx.save();
        ctx.translate(blot.x, blot.y);
        ctx.beginPath();
        for (let j = 0; j < blot.points.length; j++) {
          const pt = blot.points[j];
          const radius = blot.radius * pt.r;
          const x = Math.cos(pt.a) * radius;
          const y = Math.sin(pt.a) * radius;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        // --color-ink rgb(44, 36, 32)
        ctx.fillStyle = `rgba(44, 36, 32, ${blot.alpha})`; 
        ctx.fill();
        ctx.restore();

        blot.alpha -= 0.003;
        
        // Small splashes
        if (blot.alpha > 0.1 && Math.random() > 0.95) {
            ctx.fillStyle = `rgba(44, 36, 32, ${blot.alpha * 0.5})`;
            ctx.beginPath();
            ctx.arc(blot.x + (Math.random() - 0.5) * 50, blot.y + (Math.random() - 0.5) * 50, Math.random() * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        if (blot.alpha <= 0) {
          blots.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[60] mix-blend-multiply opacity-80 print-hidden"
      style={{ filter: 'url(#goo)' }} // optional if we add SVG filter 
    />
  );
}
