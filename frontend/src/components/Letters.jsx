import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Lock, Calendar } from 'lucide-react';

export default function Letters({ token }) {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);

  const fetchLetters = async () => {
    try {
      const res = await fetch('/api/letters', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLetters(data);
      }
    } catch (err) {
      console.error('Error fetching letters:', err);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [token]);

  const handleOpenLetter = (letter) => {
    if (letter.locked) return; // Prevent viewing locked letters
    setSelectedLetter(letter);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '600' }}>Letters for You</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
        Letters I wrote for you. Some are sealed in orbit until special dates.
      </p>

      <div className="letters-container">
        {letters.map((letter) => {
          const unlockDate = new Date(letter.unlock_date);
          const dateStr = unlockDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });

          return (
            <div 
              key={letter.id} 
              onClick={() => handleOpenLetter(letter)}
              className={`glass-panel letter-card ${letter.locked ? 'locked' : ''}`}
              style={{
                borderLeft: letter.locked 
                  ? '3px solid var(--color-text-muted)' 
                  : '3px solid var(--color-amber)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!letter.locked) e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="letter-header">
                <span className="letter-title">{letter.title}</span>
                
                <span className={`letter-status ${letter.locked ? 'locked' : 'unlocked'}`}>
                  {letter.locked ? (
                    <>
                      <Lock size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Locked</span>
                    </>
                  ) : (
                    <>
                      <MailOpen size={14} style={{ color: 'var(--color-teal)' }} />
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-teal)' }}>Open Me</span>
                    </>
                  )}
                </span>
              </div>

              <p className="letter-preview">
                {letter.locked 
                  ? `Sealing this for you until ${dateStr}...`
                  : letter.content}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.8rem' }}>
                <Calendar size={10} />
                <span>Available: {dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Reading Modal */}
      {selectedLetter && (
        <div className="modal-overlay" onClick={() => setSelectedLetter(null)}>
          <div 
            className="glass-panel modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'float 6s ease-in-out infinite' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Mail size={32} style={{ color: 'var(--color-amber)' }} />
            </div>

            <h3 className="modal-title">{selectedLetter.title}</h3>
            
            <div style={{ width: '40px', height: '1px', background: 'var(--color-amber)', margin: '0 auto' }}></div>
            
            <p className="modal-text">
              {selectedLetter.content}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              — Yours eternally
            </div>

            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedLetter(null)}
            >
              Seal Envelope
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
