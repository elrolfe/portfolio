"use strict";

const baseDir = process.cwd() + "/projects/timestamp";

var express = require("express"),
    subapp = express(),
    pug = require("pug"),
    sass = require("node-sass-middleware"),
    router = require(baseDir + "/router.js");
    
subapp.set("views", baseDir + "/resources/pug");
subapp.set("view engine", "pug");

subapp.use(sass({
    src: baseDir + "/resources/sass",
    dest: baseDir + "/resources/css",
    prefix: "/css",
    output: "compressed"
}));

subapp.use("/css", express.static(baseDir + "/resources/css"));

router(subapp);

module.exports = subapp;