const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const FILE = "./result.json";

// Home API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Kuber Laxmi Lottery API Running"
  });
});

// Get Lottery Result
app.get("/api/result", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

// Update Lottery Result
app.post("/api/update-result", (req, res) => {
  fs.writeFileSync(FILE, JSON.stringify(req.body, null, 2));

  res.json({
    success: true,
    message: "Result Updated Successfully"
  });
});

app.listen(8080, () => {
  console.log("🚀 Server Running On Port 8080");
});