"use strict";

const fs = require("fs");

var express = require("express"),
    app = express(),
    pug = require("pug"),
    sass = require("node-sass-middleware");
    
try {
    var files = fs.readdirSync(process.cwd() + "/projects");
} catch(e) {
    console.log("fs.readdirSync could not read the directory '" + process.cwd() + "/projects'");
    return -1;
}

var modulesLoaded = 0;

files.forEach((file) => {
    var path = process.cwd() + "/projects/" + file;
    if (fs.statSync(path).isDirectory()) {
        try {
            fs.accessSync(path + "/subapp.js", fs.F_OK);
        } catch(e) {
            return;
        }

        try {
            app.use("/" + file, require(path + "/subapp.js"));
            modulesLoaded++;
        } catch (e) {
            console.log("Could not load the " + file + " module!\n    " + e.message);
        }
    }
});

console.log(modulesLoaded + " modules successfully loaded");

app.set("views", process.cwd() + "/resources/pug");
app.set("view engine", "pug");

app.route("/")
    .get((req, res) => {
        res.send("Eric's Portfolio (Coming soon)");
    })

app.listen(process.env.PORT, () => {
    console.log("Portfolio app listening on " + process.env.PORT + "...");
});