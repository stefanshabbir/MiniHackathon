import dotenv from "dotenv";
dotenv.config();

import express from "express";
import routes from "./routes/index.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api", routes);

// Root
app.get("/", (req, res) => {
  res.send("Supabase API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
