const express = require("express");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const FILE = "./result.json";

// ================= HOME API =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Kuber Laxmi Lottery API Running",
  });
});

// ================= GET RESULT =================
app.get("/api/result", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE, "utf8"));

    res.json(data);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to load result",
    });
  }
});

// ================= UPDATE RESULT =================
app.post("/api/update-result", (req, res) => {
  try {
    const oldData = JSON.parse(fs.readFileSync(FILE, "utf8"));

    const newData = {
      ...oldData,
      ...req.body,

      settings: {
        ...(oldData.settings || {}),
        ...(req.body.settings || {}),
      },
    };

    fs.writeFileSync(
      FILE,
      JSON.stringify(newData, null, 2)
    );

    // 🔥 Real-time update
    io.emit("resultUpdated", newData);

    console.log("✅ Data Updated");

    res.json({
      success: true,
      message: "Result Updated Successfully",
      data: newData,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update Failed",
    });
  }
});

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
