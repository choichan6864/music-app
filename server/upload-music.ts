import { Express, Request, Response } from "express";
import { pool } from "./mysql";

const express = require("express");
const router: Express = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "public/uploads");
  },
  filename: function (req: any, file: any, cb: any) {
    const mimetype = file.mimetype.split("/")[0];
    const fileName = `album:${req.body.albumName}_${file.originalname}`;
    if (mimetype === "audio") {
      cb(null, fileName);
    } else if (mimetype === "image") cb(null, `${req.body.albumName}.png`);
  },
});
const upload = multer({ storage });

router.post(
  "/api/upload",
  upload.fields([{ name: "musicFile" }, { name: "img" }]),
  (req: Request, res: Response) => {
    req.files.musicFile.map(async (file: any) => {
      if (typeof req.body.musicName === "string")
        await pool.query(
          `INSERT INTO songs(albumName, songName,fileName, artistName) VALUES('${req.body.albumName}', '${req.body.musicName}' ,'${file.originalname}', '')`
        );
      else if (typeof req.body.musicName === "object") {
        req.body.musicName.map(async (data: any) => {
          await pool.query(
            `INSERT INTO songs(albumName, songName,fileName, artistName) VALUES('${req.body.albumName}', '${data}' ,'${file.originalname}', '')`
          );
        });
      }
    });
    res.redirect("/");
  }
);

module.exports = router;
