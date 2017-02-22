"use strict";

module.exports = function(app, baseDir) {
    var mongoose = require("mongoose"),
        flickr = require("flickrapi"),
        flickrOptions = {
            api_key: process.env.IMAGE_SEARCH_API_KEY,
            secret: process.env.IMAGE_SEARCH_API_SECRET,
            progress: false
        };
        
    var connection = mongoose.createConnection(process.env.IMAGE_SEARCH_DB);
    var Search = require(baseDir + "/app/models/search.js")(connection);
        
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
            res.render("index", {
                protocol: req.headers["x-forwarded-proto"],
                host: req.headers.host,
                base: req.baseUrl
            });
        });
        
    app.route("/api/recent")
        .get((req, res) => {
            Search.find({}).sort("-timestamp").exec((err, searches) => {
                if (err) 
                    return res.send({ error: "A database error occurred retrieving the recent searches" });

                res.send(searches.map((s) => {
                    var ts = new Date(s.timestamp);
                    return {
                        term: s.term,
                        timestamp: ts.toISOString()
                    };
                }));
            });
        });
        
    app.route("/api/search/:term")
        .get((req, res) => {
            var apiPage = 1;
            var searchTerm = req.params.term;
            var now = new Date();
            
            if (req._parsedUrl.query) {
                if (req._parsedUrl.query.substring(0, 7) == "offset=") {
                    apiPage = parseInt(req._parsedUrl.query.substring(7));
                }
            }
            
            var searchData = {
                text: searchTerm,
                page: apiPage,
                per_page: 20
            };
                        
            flickr.tokenOnly(flickrOptions, (err, flickrapi) => {
                if (err) throw err;
                
                flickrapi.photos.search(searchData, (err, result) => {
                    if (err) throw err;
                    
                    var results = {};
                    results.totalResults = result.photos.total;
                    results.currentPage = result.photos.page.toString();
                    results.images = [];
        
                    result.photos.photo.forEach((d) => {
                        results.images.push({
                            image: "https://farm" + d.farm + ".staticflickr.com/" + d.server + "/" + d.id + "_" + d.secret + "_b.jpg",
                            page: "https://www.flickr.com/photos/" + d.owner + "/" + d.id,
                            alt_text: d.title
                        });
                    });
                    
                    res.send(results);
                    
                    var newDoc = {
                        term: searchTerm,
                        timestamp: now.getTime()
                    }
                    
                    Search.create(newDoc, (err) => {
                        if (err) {
                            return console.log("An error occurred saving the search term:\n" + err);
                        }
                        
                        // Delete all except for the 10 most recent searches
                        Search.find().sort("-timestamp").limit(10).exec((err, searches) => {
                            if (err) {
                                return console.log("An error occurred getting the most recent searches");
                            }
                            
                            var ids = searches.map((s) => {
                                return s._id;
                            });
                            
                            Search.remove({ _id: { $nin: ids } }, (err) => {
                                if (err)
                                    console.log("An error occurred removing outdated search terms");
                            });
                        });
                    });
                });
            });
        });
};