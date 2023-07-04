import { Express, Request, Response } from "express";
import { pool } from "./mysql";

const express = require("express");
const router: Express = express.Router();

router.get("/api/get/music", async (req:Request, res: Response) => {
    const [music] = await pool.query("SELECT * FROM songs");
    res.status(200).send(music);
})

module.exports = router;