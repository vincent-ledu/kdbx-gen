import express from "express";
import Logger from "./utils/logger";
import "dotenv/config";
import * as KdbxManager from "./KdbxManager";
import { ProtectedValue } from "kdbxweb";
import path from "path";
import { I18n } from "i18n";
import csv from "csvtojson";

const i18n = new I18n();
i18n.configure({
  locales: ["en", "fr"],
  directory: path.join(__dirname, "locales"),
});
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.post("/kdbx", (req, res) => {
  Logger.info(req.body);
  if (req.body.json) {
    KdbxManager.createKDBX(
      req.body.json,
      ProtectedValue.fromString("test"),
      "MyDB"
    )
      .then((db) => {
        res.status(201).send(db.save());
      })
      .catch((err) => {
        Logger.error(err);
        res.status(500).send("Error while creating the stuff... sorry...");
      });
  } else {
    csv()
      .fromString(req.body.csv)
      .then((jsonObj) => {
        KdbxManager.createKDBX(
          jsonObj,
          ProtectedValue.fromString("test"),
          "MyDb"
        )
          .then((db) => {
            res.status(201).send(db.save());
          })
          .catch((err) => {
            Logger.error(err);
            res.status(500).send("Error while creating the stuff... sorry...");
          });
      });
  }
});

app.get("/", (req, res) => {
  res.render("pages/createKeepass");
});

app.listen(port, () => {
  Logger.info(`Listening server on port ${port}`);
});
