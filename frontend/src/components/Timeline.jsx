import React, { useState, useEffect } from 'react';
import { Image, Film, Plus, Calendar, Type } from 'lucide-react';

// SecureMedia component to fetch files with authorization headers and display them using Object URLs
export function SecureMedia({ src, token, className, type = 'img', ...props }) {
  const [blobUrl, setBlobUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || !token) return;

    let active = true;
    setLoading(true);
    setError(false);

    fetch(src, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load media');
        return res.blob();
      })
      .then(blob => {
        if (active) {
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (active) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src, token]);

  if (loading) {
    return (
      <div 
        className={className} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(255,255,255,0.03)',
          height: '180px',
          color: 'var(--color-text-muted)',
          fontSize: '0.8rem',
          borderRadius: '10px'
        }}
      >
        <span>Streaming secure asset...</span>
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <div 
        className={className} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'rgba(239, 68, 68, 0.05)',
          height: '120px',
          color: '#ef4444',
          fontSize: '0.8rem',
          borderRadius: '10px',
          border: '1px dashed rgba(239, 68, 68, 0.2)'
        }}
      >
        <span>Memory asset not found in orbit</span>
      </div>
    );
  }

  if (type === 'video') {
    return <video src={blobUrl} controls className={className} {...props} />;
  }

  return <img src={blobUrl} className={className} alt="" {...props} />;
}

export default function Timeline({ token }) {
  const [memories, setMemories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('photo');
  const [mediaUrl, setMediaUrl] = useState('');
  const [formError, setFormError] = useState('');

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setMemories(data);
      }
    } catch (err) {
      console.error('Error fetching memories:', err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title || !date) {
      setFormError('Please provide both a title and date.');
      return;
    }

    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          date,
          description,
          type,
          media_url: mediaUrl || null
        })
      });

      if (res.ok) {
        // Reset form
        setTitle('');
        setDate('');
        setDescription('');
        setType('photo');
        setMediaUrl('');
        setShowAddForm(false);
        // Refresh list
        fetchMemories();
      } else {
        const errData = await res.json();
        setFormError(errData.error || 'Failed to preserve memory.');
      }
    } catch (err) {
      setFormError('Connection error, please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Timeline Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: '600' }}>Our Story</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-amber)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          {showAddForm ? 'Close' : 'Add a Moment'}
        </button>
      </div>

      {/* Add Memory Form (CMS Panel) */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-panel memory-form" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--color-amber)', marginBottom: '0.5rem' }}>Save a New Moment</h4>
          
          <div className="form-group">
            <span className="form-label">What moment are we saving?</span>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Day at the Botanical Garden" 
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <span className="form-label">Date</span>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <span className="form-label">Type</span>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)} 
                className="form-input"
                style={{ background: '#0f172a' }}
              >
                <option value="photo">Photo Frame</option>
                <option value="video">Video Reel</option>
                <option value="text">Written Note</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <span className="form-label">How it felt...</span>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Capture the feeling..." 
              className="form-input" 
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="form-group">
            <span className="form-label">Media Asset Path (Optional)</span>
            <input 
              type="text" 
              value={mediaUrl} 
              onChange={e => setMediaUrl(e.target.value)} 
              placeholder="e.g. /api/media/images/filename.jpg" 
              className="form-input"
            />
          </div>

          {formError && <p className="error-msg">{formError}</p>}

          <button type="submit" className="submit-btn">Keep in Our Cosmos</button>
        </form>
      )}

      {/* Chronicle Timeline */}
      {memories.length === 0 ? (
        <div className="glass-panel empty-state">
          We haven't added any memories here yet.
        </div>
      ) : (
        <div className="timeline-container">
          <div className="timeline-line"></div>
          {memories.map((memory) => {
            const dateObj = new Date(memory.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={memory.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="glass-panel timeline-card">
                  
                  <div className="timeline-meta" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span className="timeline-type-tag">
                      {memory.type === 'photo' && <Image size={12} />}
                      {memory.type === 'video' && <Film size={12} />}
                      {memory.type === 'text' && <Type size={12} />}
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                        {memory.type}
                      </span>
                    </span>
                  </div>

                  <h4 className="timeline-title">{memory.title}</h4>
                  
                  {memory.description && (
                    <p className="timeline-desc">{memory.description}</p>
                  )}

                  {/* Render Secure authenticated images/videos if media_url is supplied */}
                  {memory.media_url && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {memory.type === 'video' ? (
                        <SecureMedia 
                          src={memory.media_url} 
                          token={token} 
                          type="video" 
                          className="timeline-media"
                        />
                      ) : (
                        <SecureMedia 
                          src={memory.media_url} 
                          token={token} 
                          type="img" 
                          className="timeline-media" 
                        />
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
