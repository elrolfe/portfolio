"use strict";

const baseDir = process.cwd() + "/projects/scatter-plot";

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
subapp.use("/img", express.static(baseDir + "/resources/img"));
subapp.use("/js", express.static(baseDir + "/resources/js"));

router(subapp);

module.exports = subapp;