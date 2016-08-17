"use strict";
var fs = require("fs");

module.exports = function(app, baseDir) {
    app.route("/")
        .get((req, res) => {
            res.render("index");
        });
        
    app.route("/json/:file")
        .get((req, res) => {
            var filePath = baseDir + "/resources/" + req.params.file + ".json";
            fs.access(filePath, fs.F_OK, (err) => {
                if (err) {
                    res.send({ error: "Invalid JSON file request" });
                } else {
                    res.sendFile(filePath);
                }
            });            
        });
};