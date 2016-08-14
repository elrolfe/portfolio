"use strict";

const fs = require("fs");

var express = require("express"),
    app = express();
    
fs.readdir(process.cwd() + "/projects", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        var path = process.cwd() + "/projects/" + file;
        if (fs.statSync(path).isDirectory()) {
            if (fs.statSync(path + "/subapp.js").isFile()) {
                app.use("/" + file, require(path + "/subapp.js"));
            }
        }
    })
});

app.listen(process.env.PORT, () => {
    console.log("Portfolio app listening on " + process.env.PORT + "...");
});