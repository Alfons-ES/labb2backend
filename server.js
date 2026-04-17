//setup

const express = require("express")
const Database = require("better-sqlite3")
const cors = require("cors")

const db = new Database("music.db")

const app = express();

app.use(cors());
app.use(express.json());
app.listen(5000, () => console.log("server open"))

//routes
//alla låtar
app.get("/music", (req, res) => {
    const music = db.prepare("SELECT * FROM music").all();
    res.json(music);
});

//en låt
app.get("/music/:id", (req, res) => {
    const music = db.prepare("SELECT * FROM music WHERE id=?").get(req.params.id);
    if (!music) return res.status(404).json({ error: "Not found" });
    res.json(music);
});

//lägg till låt
app.post("/music", (req, res) => {
    const { title, album, artist, year, genre } = req.body;

    if (!title || !album || !artist || !year || !genre) {
        return res.status(400).json({ message: "Fyll i alla fält." });
    }

    const stmt = db.prepare(`
        INSERT INTO music (title, album, artist, year, genre) VALUES (?, ?, ?, ?, ?)`);

    try {
        const result = stmt.run(title, album, artist, year, genre);
        res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    } catch (error) {
        res.status(500).json({ message: "Could not insert song" })
    }
})

//ta bort låt
app.delete("/music/:id", (req, res) => {
    const result = db.prepare("DELETE FROM music WHERE id=?").run(req.params.id);
    res.json({ message: "Deleted" });
});