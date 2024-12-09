import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import videogameRoutes from "./routes/videogame.routes.js";

config();

const APP = express();

APP.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const DB = mongoose.connection;

APP.use("/videogame", videogameRoutes);

const PORT = process.env.PORT || 8000;

APP.listen(PORT);
