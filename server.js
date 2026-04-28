const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Anslut till MongoDB
mongoose.connect("mongodb://localhost:27017/cv")
    .then(() => console.log("Ansluten till MongoDB"))
    .catch(err => console.error("Anslutningsfel:", err));

// Schema & Model
const workExperienceSchema = new mongoose.Schema({
    companyname: { type: String, required: true },
    jobtitle: { type: String, required: true },
    location: { type: String, required: true },
    startdate: { type: String, required: true },
    enddate: { type: String },
    description: { type: String, required: true }
});

const WorkExperience = mongoose.model("WorkExperience", workExperienceSchema);

// Alla jobb
app.get("/workexperience", async (req, res) => {
    try {
        const experiences = await WorkExperience.find();
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: "Kunde inte hämta data" });
    }
});

// Ett jobb
app.get("/workexperience/:id", async (req, res) => {
    try {
        const experience = await WorkExperience.findById(req.params.id);
        if (!experience) return res.status(404).json({ error: "Not found" });
        res.json(experience);
    } catch (error) {
        res.status(400).json({ message: "Ogiltigt ID" });
    }
});

// Uppdatera
app.put("/workexperience/:id", async (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    if (!companyname || !jobtitle || !location || !startdate || !description) {
        return res.status(400).json({ message: "Fyll i alla fält." });
    }

    try {
        const updated = await WorkExperience.findByIdAndUpdate(
            req.params.id,
            { companyname, jobtitle, location, startdate, enddate, description },
            { returnDocument: 'after', runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Hittades inte" });
        res.json({ message: "Uppdaterad", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Kunde inte uppdatera" });
    }
});

// Lägg till arbete
app.post("/workexperience", async (req, res) => {
    const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        return res.status(400).json({ message: "Fyll i alla fält." });
    }

    try {
        const newExperience = new WorkExperience(
            { companyname, jobtitle, location, startdate, enddate, description }
        );
        const saved = await newExperience.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: "Kunde inte lägga till arbetserfarenhet" });
    }
});

// Ta bort arbete
app.delete("/workexperience/:id", async (req, res) => {
    try {
        const deleted = await WorkExperience.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Hittades inte" });
        res.json({ message: "Deleted" });
    } catch (error) {
        res.status(400).json({ message: "Ogiltigt ID" });
    }
});

app.listen(5000, () => console.log("Server öppen på port 5000"));