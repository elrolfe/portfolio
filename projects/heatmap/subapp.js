"use strict";

const baseDir = process.cwd() + "/projects/heatmap";

var express = require("express"),
    subapp = express(),
    pug = require("pug"),
    sass = require("node-sass-middleware"),
    router = require(baseDir + "/router.js");
    
subapp.set("views", baseDir + "/resources/pug");
subapp.set("view engine", "pug");

subapp.use(sass({
    root: baseDir + "/resources",
    src: "/sass",
    dest: "/css",
    prefix: "/css",
    outputStyle: "compressed"
}));

subapp.use("/css", express.static(baseDir + "/resources/css"));
subapp.use("/img", express.static(baseDir + "/resources/img"));
subapp.use("/js", express.static(baseDir + "/resources/js"));

router(subapp, baseDir);

module.exports = subapp;