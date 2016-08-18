"use strict";

module.exports = function(autoincrement) {
    var mongoose = require("mongoose"),
        Schema = mongoose.Schema,
        passportLocalMongoose = require("passport-local-mongoose");
    
    var User = new Schema({
        username: String,
        password: String,
        displayName: {type: String, default: ""},
        facebook: {type: String, default: ""},
        twitter: {type: String, default: ""}
    });

    User.plugin(passportLocalMongoose);
    User.plugin(autoincrement.plugin, { model: "User", startAt: 1 });
    
    return mongoose.model("User", User);
}
