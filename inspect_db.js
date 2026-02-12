const db = require('./db');

async function inspect() {
    try {
        const [rows] = await db.execute('SELECT * FROM posts LIMIT 1');
        console.log('--- POSTS TABLE SCHEMA ---');
        if (rows.length > 0) {
            console.log(Object.keys(rows[0]));
            console.log('Sample Row:', rows[0]);
        } else {
            console.log('posts table is empty.');
            // Try to get column info if empty
            const [columns] = await db.execute('SHOW COLUMNS FROM posts');
            console.log('Columns:', columns);
        }
    } catch (error) {
        console.error('Error inspecting DB:', error.message);
    } finally {
        process.exit();
    }
}

inspect();
