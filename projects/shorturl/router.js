"use strict";

module.exports = function(app, baseDir) {
    var mongoose = require("mongoose"),
        autoincrement = require("mongoose-auto-increment"),
        HashIds = require("hashids"),
        hash = new HashIds("FCC URL Shortener", 5);

    var connection = null,
        ShortUrl = null;
        
    app.route("/")
        .get((req, res) => {
            res.render("index", {
                protocol: req.headers["x-forwarded-proto"],
                host: req.headers.host,
                base: req.baseUrl
            });
        });
        
    app.route("/new/*")
        .get((req, res) => {
            var validURL = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
            var url = req.url.substring(5);

            if (!validURL.test(url)) 
                return res.send({ error: url + " is not a valid URL." });

            connectToDatabase();

            // Check to see if the given url is already in the system
            ShortUrl.findOne({ url: url}, "-_id original_url short_url", (err, short) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred." });
                }
                    
                if (short) {
                    // return the retrieved object
                    disconnectFromDatabase();
                    return res.send(short);
                }
                
                // Add the new object to the database
                ShortUrl.nextCount((err, count) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred." });
                    }
                        
                    var newDoc = {
                        original_url: url,
                        short_url: req.headers["x-forwarded-proto"] + "://" + req.headers.host + req.baseUrl + "/" + hash.encode(count)
                    };
                    
                    ShortUrl.create(newDoc, (err) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({error: "A database error occurred." });
                        }
                            
                        disconnectFromDatabase();
                        return res.send(newDoc);
                    });
                });
            });
        });

    app.route("/all")
        .get((req, res) => {
            connectToDatabase();
            
            ShortUrl.find({}, "-_id original_url short_url", (err, items) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred." });
                }
                    
                disconnectFromDatabase();
                return res.send({
                    totalEntries: items.length,
                    entries: items
                });
            });
        });
        
    app.route("/:id")
        .get((req, res) => {
            connectToDatabase();
            
            var id = hash.decode(req.params.id)[0];
            ShortUrl.findOne({ _id: id }, (err, item) => {
                disconnectFromDatabase();
                if (err)
                    return res.send({ error: "A database error occurred." });
                    
                if (!item) 
                    return res.send({ error: "Invalid short code" });
                    
                res.redirect(item.original_url);
            });
        });
        
    function connectToDatabase() {
        if (connection)
            disconnectFromDatabase();
        
        connection = mongoose.connect(process.env.SHORTURL_DB);
        autoincrement.initialize(connection);
        
        ShortUrl = require(baseDir + "/app/models/shorturl.js")(autoincrement);
    }
    
    function disconnectFromDatabase() {
        if (!connection)
            return;
            
        connection.disconnect();
        connection = null;
        ShortUrl = null;
    }
};