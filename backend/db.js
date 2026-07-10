const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create memories table
    db.run(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        media_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create countdowns table
    db.run(`
      CREATE TABLE IF NOT EXISTS countdowns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        target_date TEXT NOT NULL,
        is_anniversary INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create letters table
    db.run(`
      CREATE TABLE IF NOT EXISTS letters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        unlock_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if tables are empty before seeding
    db.get('SELECT COUNT(*) AS count FROM memories', [], (err, row) => {
      if (err) return console.error(err.message);
      if (row.count === 0) {
        seedData();
      }
    });
  });
}

function seedData() {
  console.log('Seeding initial data...');

  const memories = [
    {
      title: 'Our Warmest Days',
      date: '2024-10-20',
      description: 'In your smile, I found my favorite view. Every day with you is a new page of my happiest story. You make the cold days feel like absolute warmth.',
      type: 'photo',
      media_url: '/api/media/images/memory_1.jpg'
    },
    {
      title: 'Soft Whispers of Twilight',
      date: '2024-12-05',
      description: 'Under the cosmic skies, you are my brightest star. I love you more than words can trace, and I will choose you in every twilight.',
      type: 'photo',
      media_url: '/api/media/images/memory_2.jpg'
    },
    {
      title: 'Captured Hearts',
      date: '2025-02-14',
      description: 'Just a simple moment, but with you, it becomes a lifetime treasure. You make ordinary seconds feel like absolute magic.',
      type: 'photo',
      media_url: '/api/media/images/memory_3.jpg'
    },
    {
      title: 'Holding Your Hand',
      date: '2025-04-12',
      description: 'No matter where the road leads, I want to walk it holding your hand. Step by step, heartbeat by heartbeat, forever.',
      type: 'photo',
      media_url: '/api/media/images/memory_4.jpg'
    },
    {
      title: 'My Quiet Harbor',
      date: '2025-06-20',
      description: 'When the storm outside gets loud, your voice is the only peace I need. You are my safe space, my home, my quiet harbor.',
      type: 'photo',
      media_url: '/api/media/images/memory_5.jpg'
    },
    {
      title: 'In Every Universe',
      date: '2025-08-15',
      description: 'If I were to live a thousand lifetimes, I would search for you in every single one, and I would find you every time.',
      type: 'photo',
      media_url: '/api/media/images/memory_6.jpg'
    },
    {
      title: 'Laughter and Light',
      date: '2025-10-14',
      description: 'Your laugh is my absolute favorite soundscape. It cures the heaviest days and fills my entire soul with sunshine.',
      type: 'photo',
      media_url: '/api/media/images/memory_7.jpg'
    },
    {
      title: 'The Little Things',
      date: '2025-12-25',
      description: 'It’s the way you look at me, the warmth of your touch, the silent comfort of just being near you. I love every little piece of you.',
      type: 'photo',
      media_url: '/api/media/images/memory_8.jpg'
    },
    {
      title: 'To the Moon and Back',
      date: '2026-03-30',
      description: 'From our first cafe meeting to the end of time, my heart belongs to you. You are my forever and my day one.',
      type: 'photo',
      media_url: '/api/media/images/memory_9.jpg'
    }
  ];

  const countdowns = [
    {
      title: 'Our First Anniversary',
      target_date: '2027-01-05T00:00:00Z',
      is_anniversary: 1
    },
    {
      title: 'Your Next Birthday',
      target_date: '2027-04-05T00:00:00Z',
      is_anniversary: 0
    }
  ];

  const letters = [
    {
      title: 'My Dearest Innu',
      content: `I wanted to build something that time couldn't touch—a permanent space just for us. This isn't just code or a digital screen; it is a sanctuary for every memory, every word, and every quiet moment we hold dear. A cosmic little corner of the universe that belongs entirely to you.

When I look back, my mind always returns to that exact moment we finally met face-to-face. The noise of the world seemed to fade away, and all the anticipation we had built up settled into this perfect, undeniable reality. It felt like stepping into a starry, swirling painting—vibrant and deeply alive. That was the moment everything shifted for me.

We have built such a beautiful world together since then. I cherish all of it—the quiet, poetic late nights, the birthday countdowns, and even the moments of absolute ridiculousness, like that heart-diagnosis just to catch you off guard and see you smile. Every single one of these moments is a piece of the universe we’ve created.

I often think of us escaping to some cozy mountain cabin, under a sky full of stars, far away from the rush of everything else. But until we are there, I wanted to give you this vault. You are my 🦋—bringing grace, color, and an effortless beauty to my life, even on the days I don't say it loud enough.

Whenever you miss me, or whenever you just need a reminder of how completely and deeply you are loved, I want you to unlock this space. Know that no matter where we are, I am always right here.`,
      unlock_date: '2026-07-10T00:00:00Z' // Already unlocked (today is July 10, 2026)
    },
    {
      title: 'Open on a Rainy Day',
      content: 'If you\'re reading this, it\'s probably raining outside, or maybe it\'s just raining in your heart. Remember the day our umbrella broke? We got completely soaked but it ended up being one of the happiest days. Let this letter be your digital umbrella. Take a deep breath, make some warm tea, and remember I am always holding your hand, rain or shine.',
      unlock_date: '2026-08-15T00:00:00Z' // Locked until August 2026
    },
    {
      title: 'A Letter for the Future',
      content: 'Hello, darling. If you are reading this, time has passed and we have grown. Yet, I know my love for you has only deepened. This is a letter to remind us of who we were today, and the dreams we promised to chase together. I hope we are still dancing in the kitchen and laughing at things no one else understands.',
      unlock_date: '2026-10-14T00:00:00Z' // Locked until anniversary
    }
  ];

  const stmtMem = db.prepare('INSERT INTO memories (title, date, description, type, media_url) VALUES (?, ?, ?, ?, ?)');
  memories.forEach(m => stmtMem.run(m.title, m.date, m.description, m.type, m.media_url));
  stmtMem.finalize();

  const stmtCount = db.prepare('INSERT INTO countdowns (title, target_date, is_anniversary) VALUES (?, ?, ?)');
  countdowns.forEach(c => stmtCount.run(c.title, c.target_date, c.is_anniversary));
  stmtCount.finalize();

  const stmtLet = db.prepare('INSERT INTO letters (title, content, unlock_date) VALUES (?, ?, ?)');
  letters.forEach(l => stmtLet.run(l.title, l.content, l.unlock_date));
  stmtLet.finalize();

  console.log('Seed completed successfully.');
}

module.exports = db;
