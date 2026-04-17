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
//all musik
app.get("/music", (req, res) => {
    const music = db.prepare("SELECT * FROM music").all();
    res.json(music);
})

//ett album
app.get("")
