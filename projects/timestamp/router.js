"use strict";

module.exports = function(app) {
    app.route("/")
        .get((req, res) => {
            res.render("index", {
                protocol: req.headers["x-forwarded-proto"],
                host: req.headers.host,
                base: req.headers.baseUrl
            });
        });
        
    app.route("/:input")
        .get((req, res) => {
            var dateRequest = req.params.input;
            var potentialDate = /^(\d+)|(\w+ \d{1,2}, \d{4})/i;
            var obj;
            
            if (potentialDate.test(dateRequest)) {
                var dateObject = new Date(dateRequest == parseInt(dateRequest) ? (+dateRequest * 1000) : dateRequest);
                obj = {
                    unix: parseInt(dateObject.getTime() / 1000),
                    natural: natural(dateObject)
                }
            } else {
                obj = {
                    unix: null,
                    natural: null
                }
            }
            res.json(obj);
        });
}

function natural(d) {
    if (d == "Invalid Date") return null;
    
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[d.getMonth()] + " " + d.getDate() +", " + d.getFullYear();
}
