const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API to record user interaction
app.post("/log", (req, res) => {
  const { phone, x, y } = req.body;

  const newEntry = {
    phone,
    x,
    y,
    time: new Date().toISOString()
  };

  let data = [];
  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json"));
  }

  data.push(newEntry);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

  res.json({ message: "Interaction recorded" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// API to get heatmap data
app.get("/heatmap", (req, res) => {
  if (!fs.existsSync("data.json")) {
    return res.json([]);
  }

  const data = JSON.parse(fs.readFileSync("data.json"));
  res.json(data);
});
