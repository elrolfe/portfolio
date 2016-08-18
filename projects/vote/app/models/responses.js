"use strict";

module.exports = function(autoincrement) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema;
        
    var Response = new Schema({
        poll: { type: Number, ref: "Poll" },
        answer: { type: Number, ref: "Answer" },
        user: { type: Number, ref: "User" },
        ip: String,
        created: { type: Date, default: Date.now }
    });
    
    Response.plugin(autoincrement.plugin, { model: "Response", startAt: 1 });
    
    return mongoose.model("Response", Response);
};