const db = require('./db');
// Removed bcrypt dependency for simplicity
// Actually package.json didn't have bcrypt, removed in previous steps? Let's check package.json or just use plain text for now since auth.js had "simple comparison" comment.
// Checking previous view of auth.js... it used plain text comparison in the view I saw earlier.
// "if (password !== user.password)"
// So I will insert plain text passwords.

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Create Users
        console.log('Creating users...');
        const users = [
            ['jeyav', 'jeyav@example.com', 'password123', 'Director'],
            ['nolan', 'chris@nolan.com', 'password123', 'Director'],
            ['zimmer', 'hans@zimmer.com', 'password123', 'Artist']
        ];

        for (const user of users) {
            // specific check to avoid duplicates
            const [exists] = await db.execute('SELECT id FROM users WHERE email = ?', [user[1]]);
            if (exists.length === 0) {
                await db.execute('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', user);
            }
        }

        // Get IDs
        const [userRows] = await db.execute('SELECT id, username FROM users');
        const userMap = {};
        userRows.forEach(u => userMap[u.username] = u.id);

        // 2. Create Profiles
        console.log('Creating profiles...');
        const profiles = [
            {
                username: 'jeyav',
                headline: 'Full Stack Developer',
                location: 'Chennai, India',
                avatar_url: 'https://ui-avatars.com/api/?name=Jeyav&background=0D8ABC&color=fff',
                stats: { profileViews: 120, connections: 500 }
            },
            {
                username: 'nolan',
                headline: 'Award Winning Director',
                location: 'Los Angeles, CA',
                avatar_url: 'https://ui-avatars.com/api/?name=Christopher+Nolan&background=random',
                stats: { profileViews: 50000, connections: 2000 }
            },
            {
                username: 'zimmer',
                headline: 'Film Score Composer',
                location: 'Frankfurt, Germany',
                avatar_url: 'https://ui-avatars.com/api/?name=Hans+Zimmer&background=random',
                stats: { profileViews: 30000, connections: 1500 }
            }
        ];

        for (const p of profiles) {
            const uid = userMap[p.username];
            if (uid) {
                await db.execute(`
                    INSERT INTO profiles (user_id, headline, location, avatar_url, experience, education, skills)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE headline=VALUES(headline)
                `, [uid, p.headline, p.location, p.avatar_url, JSON.stringify([]), JSON.stringify([]), JSON.stringify([])]);
            }
        }

        // 3. Create Posts
        console.log('Creating posts...');
        const posts = [
            {
                username: 'nolan',
                content: 'Cinema is a matter of what’s in the frame and what’s out. #Filmmaking',
                media_type: 'none'
            },
            {
                username: 'zimmer',
                content: 'Just finished a new track. The orchestra was on fire today! 🎻🔥',
                media_type: 'none'
            },
            {
                username: 'jeyav',
                content: 'Building CINE-SYNC! This connection between frontend and backend is smooth.',
                media_type: 'none'
            }
        ];

        for (const post of posts) {
            const uid = userMap[post.username];
            if (uid) {
                await db.execute('INSERT INTO posts (user_id, content, media_type) VALUES (?, ?, ?)',
                    [uid, post.content, post.media_type]);
            }
        }

        console.log('Seeding completed!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
