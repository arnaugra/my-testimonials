import 'dotenv/config'
import express from "express";
import authRoutes from "./routes/auth.js";
import api from "./routes/api.js";
import { setupEdge } from "./utils/setupEdge.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser  from 'cookie-parser';

import * as testimonialController from './controllers/testimonialController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();

setupEdge(app)

app.use(express.json());
app.use(cookieParser());

app.use("/storage", express.static("storage"));
app.use(express.static(__dirname + '/public'))

app.get("/", testimonialController.testimonialsList)

app.use("/", authRoutes);

app.use("/api", api)

app.get("/token/:token", testimonialController.createByToken)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
