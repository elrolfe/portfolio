"use strict";

module.exports = function(app) {
    app.route("/")
        .get((req, res) => {
            res.render("index", {
                protocol: req.headers["x-forwarded-proto"],
                host: req.headers.host,
                base: req.baseUrl
            });
        });
        
    app.route("/api")
        .get((req, res) => {
            var obj = {
                ipaddress: req.headers["x-forwarded-for"],
                language: req.headers["accept-language"].split(',')[0],
                software: req.headers["user-agent"].split('(')[1].split(')')[0]
            };
            
            res.send(obj);
        });
};