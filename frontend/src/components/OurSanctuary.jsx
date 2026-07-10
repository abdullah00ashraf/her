import React, { useState } from 'react';
import { Sparkles, Heart, Compass, Image } from 'lucide-react';
import { SecureMedia } from './Timeline';

export default function OurSanctuary({ token }) {
  const [compliment, setCompliment] = useState("Tap to read what my heart says to you...");
  const [butterflyBursts, setButterflyBursts] = useState([]);

  const sparks = [
    "You are the center of my quiet universe, Innu.",
    "Every version of my future begins and ends with you.",
    "Your laugh is my home, my favorite soundscape.",
    "You bring color and grace to my quietest skies, my 🦋.",
    "I would build a thousand digital sanctuaries just to protect your smile.",
    "You are my favorite thought, my constant muse, and my inspiration.",
    "With you, even a simple rainy cafe meeting feels like a starry painting.",
    "You make my heart beat in perfect, quiet harmony.",
    "You are the grace that transformed my world into something beautiful.",
    "No matter how far we drift, my gravity will always lead me back to you."
  ];

  const handleSparkClick = () => {
    // Select random compliment
    const randomSpark = sparks[Math.floor(Math.random() * sparks.length)];
    setCompliment(randomSpark);

    // Spawn floating butterfly elements
    const id = Date.now();
    const newButterflies = [...Array(8)].map((_, i) => ({
      id: `${id}-${i}`,
      left: Math.random() * 80 + 10, // percent
      delay: Math.random() * 0.5, // seconds
      size: Math.random() * 15 + 10, // pixels
      duration: Math.random() * 2 + 2 // seconds
    }));

    setButterflyBursts(prev => [...prev, ...newButterflies]);

    // Clean up particles after they float away
    setTimeout(() => {
      setButterflyBursts(prev => prev.filter(b => !newButterflies.find(nb => nb.id === b.id)));
    }, 4500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
      
      {/* Floating Butterflies Burst Area */}
      {butterflyBursts.map(b => (
        <span
          key={b.id}
          style={{
            position: 'fixed',
            bottom: '10%',
            left: `${b.left}%`,
            fontSize: `${b.size}px`,
            pointerEvents: 'none',
            zIndex: 1000,
            animation: `floatUp ${b.duration}s ease-out forwards`,
            animationDelay: `${b.delay}s`,
            opacity: 0.8,
          }}
        >
          🦋
        </span>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-40vh) scale(1.3) rotate(15deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-80vh) scale(0.8) rotate(-15deg);
            opacity: 0;
          }
        }
        
        .aura-card {
          padding: 1.5rem 1.2rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }
        
        .aura-card:hover {
          border-color: var(--color-amber);
          box-shadow: 0 4px 20px rgba(251, 133, 0, 0.15);
        }

        .aura-title {
          font-size: 1.1rem;
          color: var(--color-amber);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }

        .aura-text {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }
      `}</style>

      <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '600' }}>For My 🦋 Innu</h3>
      
      {/* Interactive Spark Generator */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Sparkles size={24} style={{ color: 'var(--color-amber)' }} />
        <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', color: '#fff', fontSize: '1.05rem', minHeight: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          "{compliment}"
        </p>
        <button 
          onClick={handleSparkClick}
          className="lock-button"
          style={{ width: 'auto', padding: '0.6rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Heart size={16} fill="white" />
          <span>A Spark from Me to You</span>
        </button>
      </div>

      {/* Profile Section 1: Her Vibe */}
      <div className="glass-panel aura-card">
        <h4 className="aura-title">
          <Compass size={16} />
          <span>What Makes You Magical (Your Vibe)</span>
        </h4>
        <p className="aura-text">
          You are closely associated with the butterfly (🦋) motif—a symbol of grace, transformation, and delicate beauty. It matches your elegant, gentle presence. The visual themes I have woven here for you—cosmic bursts, starry skies, and cozy mountain cabins—paint a picture of how you appreciate both awe-inspiring wonder and grounded, intimate warmth.
        </p>
      </div>

      {/* Profile Section 2: Connection */}
      <div className="glass-panel aura-card">
        <h4 className="aura-title">
          <Heart size={16} style={{ color: 'var(--color-teal)' }} />
          <span>What You Mean to Me</span>
        </h4>
        <p className="aura-text">
          The anchor of our relationship is the profound impact of the moment we finally met face-to-face—a memory so significant to me that I had to memorialize it here. Our bond is beautifully balanced: it carries the depth of a poetic romance through my digital letters and countdowns, but is always lightened by our shared laughter and playfulness, like that silly heart-diagnosis prank I built to surprise you.
        </p>
      </div>

      {/* Profile Section 3: Inspiration */}
      <div className="glass-panel aura-card">
        <h4 className="aura-title">
          <Sparkles size={16} style={{ color: '#a78bfa' }} />
          <span>How You Inspire Me, Innu</span>
        </h4>
        <p className="aura-text">
          You bring out a deeply protective and creative side in me, Innu. I am not just writing you notes; I am architecting digital sanctuaries for you. Whether I am detailing glassmorphism layouts, styling dynamic particle backgrounds, or structuring database tables, I channel all my effort to build a permanent, beautiful space that only you can enter. You are the muse behind my most personal and meticulously crafted work.
        </p>
      </div>

      {/* Personalized Canvas Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        <h4 className="aura-title" style={{ color: 'var(--color-teal)' }}>
          <Image size={16} style={{ color: 'var(--color-teal)' }} />
          <span>Personalised Canvas for Innu</span>
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[
            {
              title: "Our Cosmic Cabin",
              src: "/api/media/images/cabin_stars.png",
              quote: "I often think of us escaping to some cozy mountain cabin, under a sky full of stars, far away from the rush of everything else. — Abdullah"
            },
            {
              title: "Sealed in Orbit",
              src: "/api/media/images/cosmic_jar.png",
              quote: "Whatever our souls are made out of, his and mine are the same. — Emily Brontë"
            },
            {
              title: "My Butterfly 🦋",
              src: "/api/media/images/butterfly_rose.png",
              quote: "You are my 🦋—bringing grace, color, and an effortless beauty to my life. — Abdullah"
            },
            {
              title: "Infinite Orbits",
              src: "/api/media/images/dock_galaxy.png",
              quote: "I am hopelessly in love with a memory. An echo from another time, another place. — Michel Foucault"
            },
            {
              title: "Cozy Afternoons",
              src: "/api/media/images/cozy_library.png",
              quote: "If I had a flower for every time I thought of you… I could walk through my garden forever. — Alfred Lord Tennyson"
            }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <h5 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: '600' }}>{item.title}</h5>
              <SecureMedia 
                src={item.src} 
                token={token} 
                className="timeline-media" 
                style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <p style={{ 
                fontSize: '0.8rem', 
                color: 'var(--color-text-secondary)', 
                fontStyle: 'italic', 
                fontFamily: 'var(--font-serif)', 
                lineHeight: 1.4,
                textAlign: 'center',
                padding: '0 0.5rem' 
              }}>
                "{item.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Quote Panel */}
      <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center', borderLeft: '3px solid var(--color-amber)', background: 'rgba(251, 133, 0, 0.03)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.92rem', color: '#fff', fontStyle: 'italic', lineHeight: 1.4 }}>
          "In short, Innu, you are the person I am willing to build entire worlds for—just to make sure you always have a space where you know how deeply you are loved."
        </p>
      </div>

    </div>
  );
}
