"use strict";

module.exports = function(app, baseDir) {
    app.route("/")
        .get((req, res) => {
            res.render("index")
        });
        
    app.route("/json")
        .get((req, res) => {
            res.sendFile(baseDir + "/resources/nations.json");
        });
}