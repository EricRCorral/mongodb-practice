import { Router } from "express";
import Videogame from "../models/videogame.model.js";

const router = Router();

const getVideogame = async (req, res, next) => {
  let videogame = null;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "Videogame ID is not valid",
    });
  }

  try {
    videogame = await Videogame.findById(id);

    if (!videogame)
      return res
        .status(404)
        .json({ message: "There is no videogame with this ID" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.videogame = videogame;
  next();
};

router.get("/", async (_, res) => {
  try {
    const VIDEOGAMES = await Videogame.find();

    if (VIDEOGAMES.length === 0) return res.status(204).json([]);

    return res.json(VIDEOGAMES);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { name, genere, score, date_of_publish } = req?.body;

  if (!name || !genere || !score || !date_of_publish)
    return res.status(400).json({ message: "All fields are required" });

  const VIDEOGAME = new Videogame({
    name,
    genere,
    score,
    date_of_publish,
  });

  try {
    const NEW_VIDEOGAME = await VIDEOGAME.save();
    return res.status(201).json(NEW_VIDEOGAME);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getVideogame, async (_, res) => {
  res.json(res.videogame);
});

router.put("/:id", getVideogame, async (req, res) => {
  try {
    Object.entries(req.body).forEach(
      ([key, value]) => (res.videogame[key] = value)
    );
    await res.videogame.save();
    res.json(res.videogame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", getVideogame, async (req, res) => {
  if (Object.values(req.body).length === 0)
    return res.status(400).json({ message: "There should be a body request" });

  try {
    Object.entries(req.body).forEach(
      ([key, value]) => (res.videogame[key] = value)
    );
    await res.videogame.save();
    res.json(res.videogame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", getVideogame, async (_, res) => {
  try {
    await res.videogame.deleteOne({ _id: res.videogame.id });
    res.status(204).json({ message: "Videogame deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
