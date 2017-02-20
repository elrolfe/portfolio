"use strict";

const baseDir = process.cwd() + "/projects/leaderboard";

var express = require("express"),
    subapp = express(),
    babel = require("babel-middleware"),
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
subapp.use("/js", babel({
    srcPath: baseDir + "/resources/js"
}));

router(subapp);

module.exports = subapp;