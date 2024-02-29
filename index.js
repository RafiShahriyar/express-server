const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// mongodb connect
mongoose.connect("mongodb://localhost/authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// route
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());

// api routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
