import { Express, Request, Response, query } from "express";
import { pool } from "./mysql";

const express = require("express");
const router: Express = express.Router();
const crypto = require("crypto");
const url = require("url");

const key = process.env.KEY;
const iv = process.env.IV;
const algorithm = process.env.ALGORITHM;

const cipher = crypto.createCipheriv(algorithm, key, iv);
const decipher = crypto.createDecipheriv(algorithm, key, iv);

function createPasswd(passwd: string) {
  let result = cipher.update(passwd, "utf8", "base64");
  result += cipher.final("base64");
  return result;
}

function interpretPasswd(passwd: string) {
  let result = decipher.update(passwd, "base64", "utf8");
  result += decipher.final("utf8");
  return result;
}

router.post("/api/user/sign-in", async (req: Request, res: Response) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE id='${req.body.id}'`
  );
  const condition = {
    id: rows[0] !== undefined,
    passwd: rows[0] ? req.body.passwd === interpretPasswd(rows[0].passwd) : false,
  };

  if (condition.id && condition.passwd) {
    req.session.user = {
      id: req.body.id,
    };
    res.status(200).redirect("/");
  } else
    res.redirect(
      url.format({
        pathname: "/sign-in",
        query: condition,
      })
    );
});

router.post("/api/user/sign-up", async (req: Request, res: Response) => {
  const { passwd, id, checkedPasswd } = req.body as {
    passwd: string;
    id: string;
    checkedPasswd: string;
  };
  const [rows] = await pool.query(`SELECT * FROM users WHERE id='${id}'`);
  const auth = {
    id: !rows[0],
    passwd: passwd.length >= 8 && passwd.length <= 20,
    rechecking: passwd === checkedPasswd,
  };
  if (req.session && auth.id && auth.passwd) {
    req.session.user = { id };
    await pool.query(
      `INSERT INTO users(id, passwd) VALUES('${id}', '${createPasswd(passwd)}')`
    );
    res.redirect("/");
  } else
    res.redirect(
      url.format({
        pathname: "/sign-up",
        query: auth,
      })
    );
});

module.exports = router;
