const Database = require("better-sqlite3");
const db = new Database("cv.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS workexperience (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    companyname TEXT NOT NULL,
    jobtitle TEXT NOT NULL,
    location TEXT NOT NULL,
    startdate DATE,
    enddate DATE,
    description TEXT
    )
`);

console.log("Database created")