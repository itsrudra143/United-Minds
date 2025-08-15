require("dotenv").config();
const express = require("express");
const prisma = require("./db/client");
const cors = require("./config/cors");
const passport = require("passport");

const authRoutes = require("./modules/auth/auth.routes");

const app = express();
app.use(cors);
app.use(express.json());
app.use(passport.initialize());

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
