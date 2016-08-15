"use strict";

const fs = require("fs");

var express = require("express"),
    app = express(),
    pug = require("pug"),
    sass = require("node-sass-middleware");
    
fs.readdir(process.cwd() + "/projects", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        var path = process.cwd() + "/projects/" + file;
        if (fs.statSync(path).isDirectory()) {
            try {
                fs.accessSync(path + "/subapp.js", fs.F_OK);
                app.use("/" + file, require(path + "/subapp.js"));
            } catch(e) {}
        }
    });
});

app.set("views", process.cwd() + "/resources/pug");
app.set("view engine", "pug");

app.route("/")
    .get((req, res) => {
        res.send("Eric's Portfolio (Coming soon)");
    })

app.listen(process.env.PORT, () => {
    console.log("Portfolio app listening on " + process.env.PORT + "...");
});