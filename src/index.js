import express from "express";
import cors from "cors";
import occurrenceRoutes from "./routes/occurrenceRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/occurrences", occurrenceRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});