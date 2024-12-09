import { Schema, model } from "mongoose";

const videogame = model(
  "Videogame",
  new Schema({
    name: String,
    genere: String,
    score: Number,
    date_of_publish: Date,
  })
);

export default videogame;
