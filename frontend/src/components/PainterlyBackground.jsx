import React, { useEffect, useRef } from 'react';

export default function PainterlyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class representing Van Gogh stardust & Klimt gold leaf
    class PaintParticle {
      constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight, true);
      }

      reset(width, height, initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;
        this.speed = Math.random() * 0.5 + 0.2;
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.decay = Math.random() * 0.002 + 0.001;
        
        // Swirling offsets
        this.angleOffset = Math.random() * Math.PI * 2;
        this.flowScale = Math.random() * 0.003 + 0.001;
        
        // Colors: Klimt Gold, Starry Night Amber, Cobalt Blue, Ethereal Lavender
        const colors = [
          'rgba(251, 133, 0, ',   // Gold
          'rgba(255, 183, 3, ',   // Amber
          'rgba(78, 168, 222, ',  // Cobalt
          'rgba(167, 139, 250, '  // Lavender
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        
        // Particle Type (0: Round Stardust, 1: Klimt Shimmer Square)
        this.type = Math.random() < 0.35 ? 1 : 0;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = Math.random() * 0.02 - 0.01;
      }

      update(width, height) {
        // Swirling flow field logic inspired by Starry Night swirls
        const angle = Math.sin(this.x * this.flowScale) * Math.cos(this.y * this.flowScale) * Math.PI * 1.5 + this.angleOffset;
        
        this.x += Math.cos(angle) * this.speed;
        this.y -= this.speed * 0.6 + Math.abs(Math.sin(angle) * 0.3); // Slow upward flow
        this.rotation += this.rotSpeed;

        // Reset if drifted off screen or faded out
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset(width, height);
        }
      }

      draw(context) {
        context.save();
        context.globalAlpha = this.alpha;
        context.fillStyle = `${this.colorBase}${this.alpha})`;
        context.shadowBlur = this.type === 1 ? 6 : 4;
        context.shadowColor = this.colorBase.includes('78') ? '#4ea8de' : '#ffb703';

        if (this.type === 1) {
          // Klimt Square Gold Leaf
          context.translate(this.x, this.y);
          context.rotate(this.rotation);
          context.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
        } else {
          // Van Gogh Circular Stardust
          context.beginPath();
          context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
    }

    const particles = [];
    const maxParticles = 65; // Balanced performance & high fidelity density
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new PaintParticle(canvas.width, canvas.height));
    }

    // Swirling background trails painterly effect
    let time = 0;
    const drawSwirls = () => {
      time += 0.002;
      const width = canvas.width;
      const height = canvas.height;

      // Deep Space background base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#020617'); // Obsidian
      bgGrad.addColorStop(0.5, '#0b132b'); // Midnight Cobalt
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render 2 subtle painterly atmospheric light swirls
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      
      // Swirl 1: Center-Left Indigo nebulae flow
      const swirlGrad1 = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time) * 50, height * 0.4 + Math.cos(time) * 40, 
        10, 
        width * 0.3, height * 0.4, 
        width * 0.5
      );
      swirlGrad1.addColorStop(0, 'rgba(45, 27, 78, 0.15)'); // Cosmic Violet
      swirlGrad1.addColorStop(0.5, 'rgba(28, 37, 65, 0.08)');
      swirlGrad1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = swirlGrad1;
      ctx.fillRect(0, 0, width, height);

      // Swirl 2: Center-Right Gold/Teal flow (Klimt vibe)
      const swirlGrad2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 0.8) * 60, height * 0.6 + Math.sin(time * 0.8) * 50, 
        5, 
        width * 0.7, height * 0.6, 
        width * 0.4
      );
      swirlGrad2.addColorStop(0, 'rgba(251, 133, 0, 0.05)'); // Low opacity Gold
      swirlGrad2.addColorStop(0.4, 'rgba(78, 168, 222, 0.04)'); // Teal
      swirlGrad2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = swirlGrad2;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const animate = () => {
      // Draw painterly base swirls
      drawSwirls();

      // Update and draw particles
      particles.forEach(p => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1, 
        pointerEvents: 'none' 
      }} 
    />
  );
}
