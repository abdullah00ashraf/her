import React, { useState, useRef, useEffect } from 'react';
import { Lock, Heart } from 'lucide-react';

export default function ButterflyLock({ onUnlock }) {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isWaking, setIsWaking] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Particle class for the canvas explosion
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - Math.random() * 2; // slight upward drift
      this.radius = Math.random() * 3 + 1;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.008;
      
      // Van Gogh Starry colors (Amber, Gold, Teal, White)
      const colors = ['#ffb703', '#fb8500', '#4ea8de', '#ffffff', '#e0e1dd'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // slight gravity
      this.alpha -= this.decay;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const runExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set size to window dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const butterflyEl = document.querySelector('.butterfly-container');
    const rect = butterflyEl ? butterflyEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 3 };
    
    const startX = rect.left + 60; // Center of 120px container
    const startY = rect.top + 60;

    // Spawn initial burst
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle(startX, startY));
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Continuous spawning while waking
      if (Math.random() < 0.5) {
        particles.push(new Particle(startX, startY));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secret.trim()) return;

    setError('');
    setIsShaking(false);

    try {
      const response = await fetch('/api/auth/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsWaking(true);
        // Start the canvas particle system
        setTimeout(() => {
          runExplosion();
        }, 100);

        // Stage 2: Cosmic Burst full-screen flash (1.3s in)
        const overlay = document.querySelector('.cosmic-flash-overlay');
        setTimeout(() => {
          if (overlay) overlay.classList.add('flash');
        }, 1300);

        // Stage 3: Complete transition to main vault (2s in)
        setTimeout(() => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (overlay) overlay.classList.remove('flash');
          onUnlock(data.token);
        }, 2100);

      } else {
        setError(data.message || 'The memory fades... That is not the key.');
        setIsShaking(true);
      }
    } catch (err) {
      setError('Communication with the server was lost.');
      setIsShaking(true);
    }
  };

  return (
    <div className="lock-screen">
      {/* Background is rendered globally by PainterlyBackground */}

      {/* Explosion Canvas overlay */}
      {isWaking && <canvas ref={canvasRef} className="sparkle-canvas" />}

      {/* Glassmorphic Lock Panel */}
      <div className={`glass-panel glass-panel-glow lock-card ${isShaking ? 'shake' : ''}`}>
        
        {/* Sleeping/Waking Butterfly (🦋) */}
        <div className="butterfly-container">
          <div className={`butterfly ${isWaking ? 'waking' : 'sleeping'}`}>
            <div className="wing wing-left"></div>
            <div className="wing wing-right"></div>
            <div className="body"></div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.6rem', color: '#fff', fontWeight: '800' }}>The Innu Vault</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '280px', lineHeight: 1.5 }}>
          Locked in cosmic stasis. Enter the shared memory to awaken the capsule.
        </p>

        <form onSubmit={handleSubmit} className="lock-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="e.g. your secret keyword"
              className="lock-input"
              disabled={isWaking}
              autoComplete="off"
            />
            <Lock size={16} style={{ position: 'absolute', right: '15px', top: '15px', color: 'rgba(255,255,255,0.3)' }} />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="lock-button" disabled={isWaking}>
            {isWaking ? 'Awakening...' : 'Unlock Memories'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <Heart size={12} style={{ color: 'var(--color-amber)', fill: 'var(--color-amber)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
            "Whatever our souls are made of, yours and mine are the same."
          </span>
        </div>
      </div>
    </div>
  );
}
