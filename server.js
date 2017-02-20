"use strict";

require("dotenv").load();

const fs = require("fs");

var express = require("express"),
    app = express(),
    pug = require("pug"),
    sass = require("node-sass-middleware"),
    projects = [];
    
try {
    var files = fs.readdirSync(process.cwd() + "/projects");
} catch(e) {
    console.log("fs.readdirSync could not read the directory '" + process.cwd() + "/projects'");
    return -1;
}

app.set("views", process.cwd() + "/resources/pug");
app.set("view engine", "pug");

app.use(sass({
    root: process.cwd() + "/resources",
    src: "/sass",
    dest: "/css",
    prefix: "/css",
    outputStyle: "compressed"
}));

app.use("/css", express.static(process.cwd() + "/resources/css"));
app.use("/img", express.static(process.cwd() + "/resources/img"));

loadProjects();

app.route("/")
    .get((req, res) => {
        res.render("index");
    });
    
app.route("/reload")
    .get((req, res) => {
        loadProjects();
        res.redirect("/");
    });

app.listen(process.env.PORT, () => {
    console.log("Portfolio app listening on " + process.env.PORT + "...");
});

function loadProjects() {
    var modulesLoaded = 0;
    
    files.forEach((file) => {
        if (projects.indexOf(file) == -1) {
            var path = process.cwd() + "/projects/" + file;
            if (fs.statSync(path).isDirectory()) {
                try {
                    fs.accessSync(path + "/subapp.js", fs.F_OK);
                } catch(e) {
                    return;
                }
        
                try {
                    app.use("/" + file, require(path + "/subapp.js"));
                    projects.push(file);
                    modulesLoaded++;
                } catch (e) {
                    console.log("Could not load the " + file + " module!\n    " + e.message);
                }
            }
        }
    });
    
    console.log(modulesLoaded + " modules successfully loaded");
}