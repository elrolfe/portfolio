"use strict";

const baseDir = process.cwd() + "/projects/vote";

var express = require("express"),
    subapp = express(),
    bodyparser = require("body-parser"),
    sass = require("node-sass-middleware"),
    pug = require("pug"),
    router = require(baseDir + "/router.js");
    
subapp.enable("trust proxy");
subapp.set("views", baseDir + "/resources/pug");
subapp.set("view engine", "pug");

subapp.use(sass({
    root: baseDir + "/resources",
    src: "/sass",
    dest: "/css",
    prefix: "/css",
    output: "compressed"
}));

subapp.use("/css", express.static(baseDir + "/resources/css"));
subapp.use("/img", express.static(baseDir + "/resources/img"));
subapp.use("/js", express.static(baseDir + "/resources/js"));

subapp.use(bodyparser.json());
subapp.use(bodyparser.urlencoded({ extended: false }));

subapp.use(require("express-session")({
    secret: "FCC Vote App Secret Ballot",
    resave: false,
    saveUninitialized: false
}));

router(subapp, baseDir);

module.exports = subapp;