"use strict";

module.exports = function(app, baseDir) {
    var Yelp = require("yelp");
    var yelp = new Yelp({
        consumer_key: process.env.NIGHTLIFE_YELP_CONSUMER_KEY,
        consumer_secret: process.env.NIGHTLIFE_YELP_CONSUMER_SECRET,
        token: process.env.NIGHTLIFE_YELP_TOKEN,
        token_secret: process.env.NIGHTLIFE_YELP_TOKEN_SECRET
    });
    
    app.route("/")
        .get((req, res) => {
            res.render("index");
        });
        
    app.route("/search")
        .post((req, res) => {
            yelp.search({
                term: "bar",
                location: req.body.location,
                sort: 2
            }).then((data) => {
                res.send(data);
            }).catch((err) => {
                res.send(err);
            });
        });
};