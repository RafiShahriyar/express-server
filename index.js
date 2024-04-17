const express = require("express");
const mongoose = require("mongoose");
// const mongoose2 = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const { app, server } = require("./src/socket/socket");
// const app = express();

const PORT = process.env.PORT || 5000;

// mongodb connect
mongoose.connect("mongodb://localhost/authentication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// mongoose.connect("mongodb+srv://rafi:1234@atlascluster.i7doaey.mongodb.net/CD", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Authentication routes
const auth = require("./src/routes/auth.routes");
app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);

// Product routes
const product = require("./src/routes/product.routes");
app.use("/api/product", product);

// Payment routes
const payment = require("./src/routes/payment.routes");
app.use("/api/payment", payment);

// Message Routes
const message = require("./src/routes/message.routes");
app.use("/api/message", message);

// Offer Routes
const offer = require("./src/routes/offer.routes");
app.use("/api/offer", offer);

const forum = require("./src/routes/forum.routes");
app.use("/api/forum", forum);

//Fetch all user Routes
const users = require("./src/routes/user.routes");
app.use("/api/users", users);
// app.use(cors());
// app.use(express.json());

//Fetch all user Routes
const allUsers = require("./src/routes/allUsers.routes");
app.use("/api/allUsers", allUsers);

app.get("/", (req, res) => {
  res.send("Hello All Over the World");
});

// Search Route
const search = require("./src/routes/search.routes");
app.use("/api/search", search);

// Order History Route
const orderHistory = require("./src/routes/order.routes");
app.use("/api/order-history", orderHistory);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
