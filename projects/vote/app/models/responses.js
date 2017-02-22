"use strict";

module.exports = function(autoincrement, db) {
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
    
    return db.model("Response", Response);
};