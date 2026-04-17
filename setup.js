const Database = require("better-sqlite3");
const db = new Database("music.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS music (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    album TEXT NOT NULL,
    artist TEXT NOT NULL,
    year INTEGER,
    genre TEXT
    )
`);

console.log("Database created")