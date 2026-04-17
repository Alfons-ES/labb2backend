//setup

const express = require("express")
const Database = require("better-sqlite3")
const cors = require("cors")

const db = new Database("cv.db")

const app = express();

app.use(cors());
app.use(express.json());
app.listen(5000, () => console.log("server open"))

//routes
//alla jobb
app.get("/workexperience", (req, res) => {
    const experiences = db.prepare("SELECT * FROM workexperience").all();
    res.json(experiences);
});

//ett jobb
app.get("/workexperience/:id", (req, res) => {
    const experience = db.prepare("SELECT * FROM workexperience WHERE id=?").get(req.params.id);
    if (!experience) return res.status(404).json({ error: "Not found" });
    res.json(experience);
});

//lägg till arbete
app.post("/workexperience", (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    if (!companyname || !jobtitle || !location) {
        return res.status(400).json({ message: "Fyll i alla fält." });
    }

    const stmt = db.prepare(`
        INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description) 
        VALUES (?, ?, ?, ?, ?, ?)`);

    try {
        const result = stmt.run(companyname, jobtitle, location, startdate, enddate, description);
        res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    } catch (error) {
        res.status(500).json({ message: "Could not insert work experience" })
    }
})


//ta bort arbete
app.delete("/workexperience/:id", (req, res) => {
    const result = db.prepare("DELETE FROM workexperience WHERE id=?").run(req.params.id);
    res.json({ message: "Deleted" });
});