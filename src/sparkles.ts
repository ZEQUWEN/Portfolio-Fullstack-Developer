import React from 'react';

export function triggerSparkles(e: React.MouseEvent) {
  const container = document.body;
  
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }
  
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  const particles: any[] = [];
  const colors = ['#d4af37', '#e5c158', '#ffd700', '#ffeb73', '#8b4a4a', '#8b0000'];
  
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15 - 5,
      radius: Math.random() * 4 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.015,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      isStar: Math.random() > 0.5
    });
  }
  
  let animationFrameHover: number;
  
  function drawStar(cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, alpha: number, rotation: number) {
    if (!ctx) return;
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.translate(-cx, -cy);
    
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.restore();
  }
  
  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticles = 0;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;
      
      activeParticles++;
      p.vy += 0.3; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      p.rotation += p.rotationSpeed;
      
      if (p.isStar) {
        drawStar(p.x, p.y, 4, p.radius * 2, p.radius * 0.5, p.color, Math.max(0, p.alpha), p.rotation);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }
    }
    
    if (activeParticles > 0) {
      animationFrameHover = requestAnimationFrame(render);
    } else {
      canvas.remove();
    }
  }
  
  render();
}
