import React, { useState, useEffect } from 'react';
import './App.css';
import ButterflyLock from './components/ButterflyLock';
import Timeline from './components/Timeline';
import Letters from './components/Letters';
import OurSanctuary from './components/OurSanctuary';
import { Calendar, BookOpen, Clock, Music, LogOut, Key, Hourglass, Compass, Heart } from 'lucide-react';
import PainterlyBackground from './components/PainterlyBackground';

// Live Countdown Card sub-component
function CountdownCard({ title, dateString, isAnniversary }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(dateString) - new Date();
    
    if (isAnniversary && difference < 0) {
      // If it's a milestone in the past, count UP instead of down
      const elapsed = new Date() - new Date(dateString);
      return {
        direction: 'since',
        days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
        hours: Math.floor((elapsed / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((elapsed / 1000 / 60) % 60),
        seconds: Math.floor((elapsed / 1000) % 60)
      };
    }

    return {
      direction: 'until',
      days: Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))),
      hours: Math.max(0, Math.floor((difference / (1000 * 60 * 60)) % 24)),
      minutes: Math.max(0, Math.floor((difference / 1000 / 60) % 60)),
      seconds: Math.max(0, Math.floor((difference / 1000) % 60))
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [dateString]);

  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass-panel countdown-card" style={{ borderLeft: '3px solid var(--color-teal)' }}>
      <h4 className="countdown-title">{title}</h4>
      <div className="countdown-timer">
        <div className="time-segment">
          <span className="time-num">{timeLeft.days}</span>
          <span className="time-label">Days</span>
        </div>
        <div className="time-segment">
          <span className="time-num">{timeLeft.hours}</span>
          <span className="time-label">Hrs</span>
        </div>
        <div className="time-segment">
          <span className="time-num">{timeLeft.minutes}</span>
          <span className="time-label">Mins</span>
        </div>
        <div className="time-segment">
          <span className="time-num">{timeLeft.seconds}</span>
          <span className="time-label">Secs</span>
        </div>
      </div>
      <p className="countdown-date">
        {timeLeft.direction === 'since' 
          ? `Loving you every second since ${formattedDate}` 
          : `Counting down until ${formattedDate}`}
      </p>
    </div>
  );
}

// Main App component
function App() {
  const [token, setToken] = useState(localStorage.getItem('vault_token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('chronicle');
  const [countdowns, setCountdowns] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // Validate stored token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/validate', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('vault_token');
          setToken(null);
        }
      } catch (err) {
        console.error('Initial verification failed, server offline:', err);
      } finally {
        setIsInitializing(false);
      }
    };
    validateToken();
  }, [token]);

  // Load countdown metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCountdowns = async () => {
      try {
        const res = await fetch('/api/countdowns', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCountdowns(data);
        }
      } catch (err) {
        console.error('Error loading countdowns:', err);
      }
    };
    fetchCountdowns();
  }, [isAuthenticated, token]);

  const handleUnlock = (newToken) => {
    localStorage.setItem('vault_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    localStorage.removeItem('vault_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  if (isInitializing) {
    return (
      <div className="app-shell">
        <div className="mobile-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>Opening Time Capsule...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Absolute fullscreen flash screen transition */}
      <div className="cosmic-flash-overlay"></div>

      {/* Dynamic living painterly background */}
      <PainterlyBackground />

      <div className="mobile-container">
        {!isAuthenticated ? (
          <ButterflyLock onUnlock={handleUnlock} />
        ) : (
          <>
            {/* Vault Header */}
            <header className="vault-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 className="vault-title">The Innu Vault</h1>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-teal)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  My Sanctuary for You, Innu
                </span>
              </div>
              <button onClick={handleLock} className="logout-button" title="Lock Vault">
                <LogOut size={20} />
              </button>
            </header>

            {/* Main Content Area */}
            <main className="content-area">
              
              {activeTab === 'chronicle' && (
                <Timeline token={token} />
              )}

              {activeTab === 'letters' && (
                <Letters token={token} />
              )}

              {activeTab === 'countdowns' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '600' }}>Our Shared Time</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                    Counting every heartbeat since we became us, and looking forward to our future milestones.
                  </p>
                  
                  {/* Hardcoded First Date Countup (A lovely addition) */}
                  <CountdownCard 
                    title="Our Journey Together" 
                    dateString="2026-01-05T00:00:00Z" 
                    isAnniversary={true} 
                  />

                  {/* Seeded countdowns from db */}
                  <div className="countdowns-grid">
                    {countdowns.map((cd) => (
                      <CountdownCard 
                        key={cd.id} 
                        title={cd.title} 
                        dateString={cd.target_date} 
                        isAnniversary={cd.is_anniversary === 1}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sanctuary' && (
                <OurSanctuary token={token} />
              )}

            </main>

            {/* Background is rendered globally by PainterlyBackground */}

            {/* Bottom Tab Bar Navigation */}
            <nav className="tab-navigation">
              <button 
                onClick={() => setActiveTab('chronicle')} 
                className={`tab-btn ${activeTab === 'chronicle' ? 'active' : ''}`}
              >
                <Calendar size={22} />
                <span>Chronicle</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('letters')} 
                className={`tab-btn ${activeTab === 'letters' ? 'active' : ''}`}
              >
                <BookOpen size={22} />
                <span>Letters</span>
              </button>

              <button 
                onClick={() => setActiveTab('countdowns')} 
                className={`tab-btn ${activeTab === 'countdowns' ? 'active' : ''}`}
              >
                <Hourglass size={22} />
                <span>Clock</span>
              </button>

              <button 
                onClick={() => setActiveTab('sanctuary')} 
                className={`tab-btn ${activeTab === 'sanctuary' ? 'active' : ''}`}
              >
                <Heart size={22} />
                <span>For 🦋</span>
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
