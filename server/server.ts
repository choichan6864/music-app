import { Express, NextFunction, Request, Response } from "express";
import { config } from "dotenv";
config();
import next from "next";

const express = require("express");
const server: Express = express();
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = dev ? 3000 : 80;

declare global {
  namespace Express {
    interface Request {
      files: any;
      session: {
        user: {
          id: string;
        };
      };
    }
  }
}
const options = {
	host: process.env.host,
	user: process.env.USER,
	password: process.env.PASSWD,
	database: process.env.DB
};

const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);

const sessionStore = new MySQLStore(options);

const uploadMusic = require("./upload-music");
const music = require("./music");
const userAPi = require("./user-api");

app.prepare().then(() => {
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      name:"session",
      resave: false,
      store: sessionStore,
    }) 
  );

  server.use(uploadMusic);
  server.use(music);
  server.use(userAPi);

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(404).send({ messsage: "error" });
    process.exit(-1);
  });

  server.listen(port, () => {
    console.log(port);
  });
});
