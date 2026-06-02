import "./config/env.js";

import express from "express";
import cors from "cors";

import occurrenceRoutes from "./routes/occurrenceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import geocodeRoutes from "./routes/geocodeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/occurrences", occurrenceRoutes);
app.use("/auth", authRoutes);
app.use("/geocode", geocodeRoutes);
app.use("/comments", commentRoutes);

// Rota para saber se está online ou não
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "API funcionando"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});