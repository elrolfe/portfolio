"use strict";

module.exports = function(app, baseDir) {
    var mongoose = require("mongoose"),
        autoincrement = require("mongoose-auto-increment"),
        passport = require("passport"),
        LocalStrategy = require("passport-local").Strategy,
        FacebookStrategy = require("passport-facebook").Strategy,
        TwitterStrategy = require("passport-twitter").Strategy,
        configAuth = require(baseDir + "/auth.js");
        
    var localStrategyUsed = false,
        facebookStrategyUsed = false,
        twitterStrategyUsed = false;
        
    var connection = null,
        User = null,
        Poll = null,
        Answer = null,
        Response = null;
        
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    app.route("/")
        .get((req, res) => {
            res.render("index", { user: req.session.user || null });
        });
        
    app.route("/auth/facebook")
        .get((req, res, next) => {
            if (!facebookStrategyUsed) {
                passport.use(new FacebookStrategy({
                    clientID: configAuth.facebook.appID,
                    clientSecret: configAuth.facebook.appSecret,
                    callbackURL: configAuth.facebook.appCallback
                }, (access, refresh, profile, done) => {
                    process.nextTick(() => {
                        return done(null, profile);
                    });
                }));
                facebookStrategyUsed = true;
            }
            
            return next();
        }, passport.authenticate("facebook"));
        
    app.route("/auth/facebook/callback")
        .get(passport.authenticate("facebook", { failureRedirect: "/vote/login/error" }), (req, res) => {
            // Successfully authenticated a Facebook user.  See if we can find the user in the database
            connectToDatabase();
            User.findOne({ facebook: req.user.id }, (err, user) => {
                if (err) {
                    console.log(err);
                    disconnectFromDatabase();
                    return;
                }
                
                // Add the authenticated Facebook user to the database if not already there,
                // then redirect to the user profile page
                if (user === null) {
                    user = new User({
                        displayName: req.user.displayName,
                        facebook: req.user.id
                    });
                    user.save((err) => {
                        disconnectFromDatabase();

                        if (err) {
                            console.log(err);
                            return;
                        }
                        
                        req.session.user = user;
                        res.redirect("/vote/user/" + user._id);
                    });
                } else {
                    disconnectFromDatabase();
                    req.session.user = user;
                    res.redirect("/vote/user/" + user._id);
                }
            });
        });
        
    app.route("/auth/twitter")
        .get((req, res, next) => {
            if (!twitterStrategyUsed) {
                passport.use(new TwitterStrategy({
                    consumerKey: configAuth.twitter.appID,
                    consumerSecret: configAuth.twitter.appSecret,
                    callbackURL: configAuth.twitter.appCallback
                }, (access, refresh, profile, done) => {
                    process.nextTick(() => {
                        return done(null, profile);
                    });
                }));
                twitterStrategyUsed = true;
            }
            
            return next();
        }, passport.authenticate("twitter"));

    app.route("auth/twitter/callback")
        .get(passport.authenticate("twitter", { failureRedirect: "/vote/login/error" }), (req, res) => {
            // Successfully authenticated a Twitter user.  See if we can find the user in the database
            connectToDatabase();
            User.findOne({ twitter: req.user.id }, (err, user) => {
                if (err) {
                    console.log(err);
                    disconnectFromDatabase();
                    return;
                }
                
                // Add the authenticated Twitter user to the database if not already there,
                // then redirect to the user profile page
                if (user === null) {
                    user = new User({
                        displayName: req.user.displayName,
                        twitter: req.user.id
                    });
                    user.save((err) => {
                        disconnectFromDatabase();
                        
                        if (err) {
                            console.log(err);
                            return;
                        }
                        req.session.user = user;
                        res.redirect("/vote/user/" + user._id);
                    });
                } else {
                    disconnectFromDatabase();
                    req.session.user = user;
                    res.redirect("/vote/user/" + user._id);
                }
            });
        });
        
    app.route("/login")
        .post((req, res, next) => {
            connectToDatabase();
            if (!localStrategyUsed) {
                passport.use(new LocalStrategy(User.authenticate()));
                localStrategyUsed = true;
            }
            
            return next();
        }, 
        passport.authenticate("local", { failureRedirect: "/vote/login/error" }), 
        (req, res) => {
            // The local user has been authenticated.  Redirect to the user profile page.
            disconnectFromDatabase();
            req.session.user = req.user;
            res.redirect("/vote/user/" + req.user._id);
        });
        
    app.route("/login/error")
        .get((req, res) => {
            disconnectFromDatabase();
            res.render("index", { message: { type: "alert-danger", message: "Your login request could not be authenticated.  Please try again." } });
        });
        
    app.route("/logout")
        .get((req, res) => {
            req.session.user = null;
            req.logout();
            res.render("index", { message: { type: "alert-info", message: "You have successfully logged out." } });
        });

    app.route("/polls")
        .get((req, res) => {
            // Route to render the All Polls page
            res.render("polls", { user: req.session.user || null });
        })
        .post((req, res) => {
            // Route to return an object containing a certain number of polls
            connectToDatabase();
            
            // Set search parameters
            var numberOfPolls = req.body.maxpolls || 50;  // Number of polls to return, if possible.  Defaults to 50
            var pollOffset = req.body.offset || 0;  // Starting offset of the polls to return.  Defaults to 0
            var author = (req.body.author ? { user: req.body.author } : {});
            var sortArray = (req.body.sortFields || [{ field: "created", direction: "desc" }]);  // Sort criteria.  Defaults to newest polls first
            var sortString = sortArray.map((sa) => {
                return (sa.direction == "desc" ? "-" : "") + sa.field;
            }).join(" ");   // Convert the search criteria into a string value
            
            // Find polls that match the search parameters
            Poll.find(author).sort(sortString).skip(pollOffset).limit(numberOfPolls).exec((err, polls) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred accessing the polls" });
                }
    
                // Get all of the poll ids
                var pollIDs = polls.map((p) => {
                    return p._id;
                });
                
                // Get all of the poll authors' user ids
                var userIDs = polls.map((p) => {
                    return p.user;
                });
                
                // Find all answer options associated with the found polls
                Answer.find({ poll: { $in: pollIDs } }, (err, answers) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred accessing the poll answers" });
                    }
                    
                    // Determine the number of possible answers for each poll
                    var answerCount = {};
                    answers.forEach((a) => {
                        answerCount[a.poll] = (answerCount[a.poll] || 0) + 1;
                    });
                    
                    // Find all of the poll authors
                    User.find({ _id: { $in: userIDs } }, (err, users) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error occurred accessing the poll users" });
                        }

                        // Get all of the poll authors' display names
                        var userMap = {};
                        users.forEach((u) => {
                            userMap[u._id] = u.displayName;
                        });
                        
                        // Get the number of responses
                        Response.find({ poll: { $in: pollIDs } }, (err, responses) => {
                            disconnectFromDatabase();

                            if (err) {
                                return res.send({ error: "A database error occurred accessing the poll responses" });
                            }
                            
                            // Determine the number of responses for each poll
                            var responseCount = {};
                            responses.forEach((r) => {
                                responseCount[r.poll] = (responseCount[r.poll] || 0) + 1;
                            });

                            // Map the poll data to an object array
                            var returnData = polls.map((p) => {
                                return {
                                    _id: p._id,
                                    question: p.question,
                                    author: userMap[p.user],
                                    responses: responseCount[p._id] || 0,
                                    answers: answerCount[p._id] || 0
                                };
                            });
    
                            // The polls should not be editable, unless we are returning
                            // polls for the current user's profile page (meaning the 
                            // req.body.author value will match the current user id)
                            var editable = false;
                            if (req.session.user && req.session.user._id == req.body.author)
                                editable = true;
                                
                            // Return the polls to the requester.
                            res.send({ polls: returnData, editable: editable});
                        });
                    });
                });
            });
        });

    app.route("/polls/new")
        .post((req, res) => {
            // If a user isn't logged in, redirect to the home page
            var sessionUser = req.session.user || null;
            if (!sessionUser)
                return res.render("index", { message: { type: "alert-danger", message: "You must be logged in to create a new poll." } });
                
            // If no poll question was given, redirect to the home page
            if (req.body.question.trim() == "")
                return res.render("index", { message: { type: "alert-warning", message: "A question must be provided to create a new poll." }, user: req.session.user });
                
            connectToDatabase();
            
            // Create the new poll and save it to the database
            var poll = new Poll({
                user: sessionUser._id,
                question: req.body.question
            });
            poll.save((err) => {
                if (err) {
                    disconnectFromDatabase();
                    throw err;
                }
                
                if (req.body.answers.trim() !== "") {
                    // We potentially have poll answers
                    // Create an array of answer documents
                    var answers = req.body.answers.split("\n");
                    var documents = [];
                    for (var i = 0; i < answers.length; i++) {
                        if (answers[i].trim() !== "")
                            documents.push({
                                poll: poll._id,
                                user: sessionUser._id,
                                order: i,
                                answer: answers[i].trim()
                            });
                    }
                    
                    // Save any answer documents to the database, and redirect to the poll edit page
                    if (documents.length > 0) {
                        Answer.create(documents, (err) => {
                            disconnectFromDatabase();
                            
                            if (err) throw err;
                            
                            res.redirect("/vote/polls/" + poll._id);
                        });
                    } else {
                        disconnectFromDatabase();
                        res.redirect("/vote/polls/" + poll._id);
                    }
                }
            });
        });

    app.route("/polls/random")
        .get((req, res) => {
            connectToDatabase();
            
            Poll.count({}, (err, count) => {
                disconnectFromDatabase();
                if (err) return res.render("index", { message: { type: "alert-danger", message: "A database error has occurred trying to get a random poll!" }, user: (req.session.user || null) });
                
                if (count === 0)
                    return res.render("index", { message: { type: "alert-info", message: "No polls have been created yet!" }, user: (req.session.user || null) });
                    
                res.redirect("/vote/polls/" + (Math.floor(count * Math.random()) + 1));
            });
        });

    app.route("/polls/search")
        .get((req, res) => {
            res.render("search", { searchTerm: req.query.q, user: req.session.user || null });
        })
        .post((req, res) => {
            // Separate terms for the reqular expression search
            var terms = req.body.searchTerm.split(" ");
            var searchString = "(" + req.body.searchTerm + ")";
            terms.forEach((t) => {
                searchString += "|(" + t + ")";
            });
            
            connectToDatabase();
            
            // Find all polls whose quetion matches the search terms
            Poll.find({ question: new RegExp(searchString, "i") }, (err, polls) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred searching the polls" });
                }
                
                // Create convenience variables
                var pollIDs = polls.map((p) => {
                    return p._id;
                });
                
                var userIDs = polls.map((p) => {
                    return p.user;
                });
                
                // Get the users who authored the polls
                User.find({ _id: { $in: userIDs } }, (err, users) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred finding the users" });
                    }
                    
                    // Create convenience variable
                    var userSet = {};
                    users.forEach((u) => {
                        userSet[u._id] = u.displayName;
                    });
                    
                    // Get the number or responses for each poll
                    Response.aggregate([
                        { $match: { poll: { $in : pollIDs } } },
                        { $group: { _id: "$poll", number: { $sum: 1 } } }
                    ], (err, responses) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error occurred counting the responses" });
                        }
                        
                        // Create convenience variable
                        var responseSet = {};
                        responses.forEach((r) => {
                            responseSet[r._id] = r.number;
                        });

                        // Get the number of answer options for each poll
                        Answer.aggregate([
                            { $match: { poll: { $in : pollIDs } } },
                            { $group: { _id: "$poll", number: { $sum : 1 } } }
                        ], (err, answers) => {
                            disconnectFromDatabase();

                            if (err) return res.send({ error: "A database error occurred counting the answer options" });
                            
                            // Create convenience variable
                            var answerSet = {};
                            answers.forEach((a) => {
                                answerSet[a._id] = a.number;
                            });
                            
                            // Setup return data
                            var returnData = polls.map((p) => {
                                return {
                                    _id: p._id,
                                    question: p.question,
                                    author: userSet[p.user],
                                    responses: responseSet[p._id] || 0,
                                    answers: answerSet[p._id]
                                };
                            });
                            
                            res.send({ polls: returnData });
                        });
                    });
                });
            });
        });

    app.route("/polls/top")
        .get((req, res) => {
            res.render("toppolls", { user: req.session.user || null });
        })
        .post((req, res) => {
            connectToDatabase();
            
            // Get the poll ids with the most responses
            Response.aggregate([
                { $group: { _id: "$poll", number: { $sum: 1 } } },
                { $sort: { number: -1 } },
                { $limit: 10 }
            ], (err, responses) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred gathering the results" });
                }

                // Get the polls associated with the top responses
                Poll.find({ _id: { $in: responses.map((r) => { return r._id; }) } }, (err, polls) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred accessing the polls" });
                    }
                    
                    // Get the users who authored the polls
                    User.find({ _id: { $in: polls.map((p) => { return p.user; }) } }, (err, users) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error occurred accessing the users" });
                        }
                        
                        // Get the number of answer options for each poll
                        Answer.aggregate([
                            { $match: { poll: { $in: responses.map((r) => {return r._id; }) } } },
                            { $group: { _id: "$poll", number: { $sum: 1 } } },
                        ], (err, answers) => {
                            disconnectFromDatabase();
                            
                            if (err) return res.send({ error: "A database error occurred accessing the answers" });
                            
                            // Create convenience variables
                            var pollSet = {};
                            polls.forEach((p) => {
                                pollSet[p._id] = p;
                            });
                            
                            var userSet = {};
                            users.forEach((u) => {
                                userSet[u._id] = u.displayName;
                            });
                            
                            var answerSet = {};
                            answers.forEach((a) => {
                                answerSet[a._id] = a.number;
                            });
                            
                            // Create the return data set
                            var returnData = responses.map((r) => {
                                return {
                                    _id: r._id,
                                    question: pollSet[r._id].question,
                                    author: userSet[pollSet[r._id].user],
                                    responses: r.number,
                                    answers: answerSet[r._id]
                                };
                            });
                            
                            res.send({ polls: returnData });
                        });
                    });
                });
            });
        });

    app.route("/polls/:pollID/answers")
        .post((req, res, next) => {
            connectToDatabase();
            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error ocurred" });
                }
                
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.send({ error: "The specified poll does not exist!" });
                }
                
                queryAnswers(req, res);
            });
        });
        
    app.route("/polls/:pollID/answers/add")
        .post((req, res) => {

            // Is a user logged in?
            if (!req.session.user)
                return res.send({ error: "You must be logged in to provide answers" });
                
            // Did the user potentially provide any answers?
            if (req.body.newAnswers.trim() == "")
                return res.send({ error: "No new answers given" });
                
            connectToDatabase();
            
            // Find the poll to add answers to
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred" });
                }
                
                // Does the poll exist?
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.send({ error: "The specified poll does not exist!" });
                }
                
                // For proper ordering, find how many answers already exist for the poll
                Answer.count({ poll: req.params.pollID }, (err, answerCount) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred" });
                    }
                    
                    // Create answer documents from the provided answers
                    var answers = req.body.newAnswers.split("\n");
                    var documents = [];
                    for (var i = 0; i < answers.length; i++) {
                        if (answers[i].trim() !== "")
                            documents.push({
                                poll: poll._id,
                                user: req.session.user._id,
                                order: (answerCount + i),
                                answer: answers[i].trim()
                            });
                    }
                    
                    // Do we actually have any new answers?
                    if (documents.length == 0)
                        return res.send({ error: "No new answers given" });
                        
                    // Add the answers to the database
                    Answer.create(documents, (err) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error occurred" });
                        }
    
                        // Return all answers stored in the database for the poll
                        queryAnswers(req, res);
                    });
                });
            });
        });

    app.route("/polls/:pollID/answers/remove")
        .post((req, res) => {

            // Is a user logged in?
            if (!req.session.user)
                return res.send({ error: "You must be logged in to remove answers" });
                
            // Do we have an answer id to remove?
            if (req.body.id == "")
                return res.send({ error: "No answer given to remove" });
    
            connectToDatabase();
            
            // Find the given poll            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred" });
                }
                
                // Does the poll exist?
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.send({ error: "The poll you are trying to remove an answer from does not exist!" });
                }
                    
                // Find the answer to be removed
                Answer.findOne({ _id: req.body.id }, (err, answer) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred" });
                    }
                    
                    // Does the answer exist?
                    if (answer === null) {
                        disconnectFromDatabase();
                        return res.send({ error: "The answer you are trying to remove does not exist!" });
                    }
                        
                    // Is the answer part of the given poll?
                    if (answer.poll !== poll._id) {
                        disconnectFromDatabase();
                        return res.send({ error: "The answer you are trying to remove does not belong to the given poll!" });
                    }
                    
                    // Remove any responses that chose this answer
                    Response.remove({ answer: req.body.id }, (err) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error occurred" });
                        }
                        
                        // Re-order any answers that appear after the answer being removed
                        Answer.where({ order : { $gt: answer.order }})
                        .setOptions({ multi: true })
                        .update({ $inc: { order: -1 }}, (err) => {
                            if (err) {
                                disconnectFromDatabase();
                                return res.send({ error: "A database error occurred" });
                            }
                            
                            // Remove the answer
                            Answer.remove({ _id: req.body.id}, (err) => {
                                if (err) {
                                    disconnectFromDatabase();
                                    return res.send({ error: "A database error occurred" });
                                }
            
                                // Return all answers stored in the database for the poll
                                queryAnswers(req, res);
                            });
                        });
                    });
                });
            });
        });

    app.route("/polls/:pollID/edit")
        .get((req, res, next) => {
            if (req.params.pollID != parseInt(req.params.pollID))
                return next();

            // If a user is not logged in, redirect to the single poll display page
            if (!req.session.user)
                return res.redirect("/vote/polls/" + req.params.pollID);
                
            // Find the specified poll
            
            connectToDatabase();
            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                disconnectFromDatabase();
                
                if (err) throw err;
                
                // If the poll doesn't exist, redirect to the home page
                if (poll === null)
                    return res.redirect("/");
                
                // If the current user is not the poll author, redirect to the single poll display page
                if (poll.user !== req.session.user._id)
                    return res.redirect("/vote/polls/" + req.params.pollID);
                    
                 res.render("edit-poll", { poll: poll, user: req.session.user });

            });
        });

    app.route("/polls/:pollID/remove")
        .get((req, res, next) => {
            if (req.params.pollID != parseInt(req.params.pollID))
                return next();
                
            if (req.query.p !== "edit" && req.query.p !== "profile")
                return res.render("index", { message: { type: "alert-danger", message: "Invalid request to remove a poll!" } });
                
            var sessionUser = req.session.user || null;
            
            if (!sessionUser) return res.render("index", { message: { type: "alert-warning", message: "You must be logged in to remove a poll" } });

            connectToDatabase();
            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.render("index", { user: sessionUser, message: { type: "alert-danger", message: "A database error occurred trying to access the polls!" } });
                }
                
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.render("index", { user: sessionUser, message: { type: "alert-danger", message: "The specified poll does not exist!" } });
                }
                    
                // Remove all responses to the poll
                Response.remove({ poll: poll._id }, (err) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.render("userprofile", { user: sessionUser, message: { type: "alert-danger", message: "A database error occurred trying to remove the responses!" } });
                    }
                    
                    // Remove all answer options for the poll
                    Answer.remove({ poll: poll._id }, (err) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.render("userprofile", { user: sessionUser, message: { type: "alert-danger", message: "A database error occurred trying to remove the answers!" } });
                        }
                        
                        // Finally, remove the poll
                        Poll.remove({ _id: poll._id }, (err) => {
                            disconnectFromDatabase();
                            if (err) return res.render("userprofile", { user: sessionUser, message: { type: "alert-danger", message: "A database error occurred trying to remove the poll!" } });

                            res.render("userprofile", { user: sessionUser, message: { type: "alert-success", message: "The poll \"" + poll.question + "\" was successfully removed" } });
                        });
                    });
                });
            });
        });

    app.route("/polls/:pollID/results")
        .post((req, res, next) => {
            if (req.params.pollID != parseInt(req.params.pollID))
                return next();

            connectToDatabase();
            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred trying to access the poll" });
                }
                
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.send({ error: "The poll wasn't found in the database!" });
                }
                
                Answer.find({ poll: req.params.pollID }).sort({ order: "asc" }).exec((err, answers) => {
                    if (err) {
                        disconnectFromDatabase();
                        return res.send({ error: "A database error occurred trying to access the answer options" });
                    }

                    Response.find({ poll: req.params.pollID }, (err, results) => {
                        disconnectFromDatabase();
                        
                        if (err) return res.send({ error: "A database error occurred trying to access the poll results" });
                        
                        if (results === null) return res.send({ error: "No responses have been submitted yet."});
                        
                        var chartType = (answers.length < 6 ? "doughnut" : "bar");
                        
                        var numberLabels = [];
                        var textLabels = [];
                        var votes = [];
                        var answerIndex = {};
                        var index = 0;
                        var userAnswer = -1;
                        var userID = (req.session.user ? req.session.user._id : req.ip);

                        answers.forEach((a) => {
                            answerIndex[a._id] = index++;
                            numberLabels.push(index.toString());
                            textLabels.push(a.answer);
                            votes.push(0);
                        });
                        
                        results.forEach((r) => {
                            votes[answerIndex[r.answer]]++;
                            if (r.user == userID || r.ip == userID)
                                userAnswer = answerIndex[r.answer];
                        });
                        
                        var data = {
                            type: chartType,
                            labels: numberLabels,
                            answers: textLabels,
                            results: votes,
                            userAnswer: userAnswer
                        };
                        
                        res.send(data);
                    });                  
                });
            });
        });

    app.route("/polls/:pollID/vote")
        .post((req, res, next) => {
            if (req.params.pollID != parseInt(req.params.pollID))
                return next();

            // Make sure we're being sent valid data
            if ((req.body.pollID !== req.params.pollID) || 
                (!req.body.vote) || 
                (req.body.vote < 0 && !(req.session.user && req.body.customAnswer !== "")))
                return res.send({ error: "Invalid vote data provided" });
                
            connectToDatabase();
            
            // Make sure the poll exists
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error has occurred" });
                }
                
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.send({ error: "The poll does not exist!" });
                }
                
                if (req.body.vote < 0) {
                    // The user is providing a custom vote.
                    
                    // Get the current number of answers for this poll
                    Answer.count({ poll: poll._id }, (err, answerCount) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error has occurred" });
                        }
                        
                        // Add the new answer to the answer database
                        var answer = new Answer({
                            poll: poll._id,
                            user: req.session.user._id,
                            order: answerCount,
                            answer: req.body.customAnswer
                        });
                        
                        answer.save((err) => {
                            if (err) {
                                disconnectFromDatabase();
                                return res.send({ error: "A database error has occurred" });
                            }
                            
                            addResponse(req, res, answer);
                        });
                    });
                } else {
                    Answer.findOne({ _id: req.body.vote }, (err, answer) => {
                        if (err) {
                            disconnectFromDatabase();
                            return res.send({ error: "A database error has occurred" });
                        }
                        
                        if (answer === null) {
                            disconnectFromDatabase();
                            return res.send({ error: "The answer could not be found in the database! (" + req.body.vote + ")" });
                        }
                        
                        addResponse(req, res, answer);
                    });
                }
            });
        });

    app.route("/polls/:pollID")
        .get((req, res, next) => {
            if (req.params.pollID != parseInt(req.params.pollID))
                return next();
                
            connectToDatabase();
            
            Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
                if (err) {
                    disconnectFromDatabase();
                    throw err;
                }
                
                if (poll === null) {
                    disconnectFromDatabase();
                    return res.redirect("/vote");
                }
                    
                User.findOne({ _id: poll.user }, (err, author) => {
                    disconnectFromDatabase();
                    if (err) throw err;
                    
                    poll.author = author.displayName;
                    
                    res.render("single-poll", { poll: poll, user: (req.session.user || null) });
                });
            });
        });

    app.route("/register")
        .get((req, res) => {
            res.render("register");
        })
        .post((req, res) => {
            connectToDatabase();

            if (!localStrategyUsed) {
                passport.use(new LocalStrategy(User.authenticate()));
                localStrategyUsed = true;
            }

            User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.render("register", { user: user });
                }
                
                passport.authenticate("local")(req, res, () => {
                    disconnectFromDatabase();
                    req.user.displayName = req.body.displayName;
                    req.user.save();
                    req.session.user = req.user;
                    res.redirect("/vote/user/" + req.user._id);
                });
            });
        });
        
    app.route("/user")
        .get((req, res) => {
            var sessionUser = req.session.user || null;
            
            if (!sessionUser)
                res.render("index", { message: { type: "alert-warning", message: "You must be logged in to view your user profile." } });
            else
                res.redirect("/vote/user/" + sessionUser._id);
        });
        
    app.route("/user/check")
        .post((req, res) => {
            if (!req.body.name || req.body.name == "")
                return res.send({ available: false });
                
            connectToDatabase();
            
            User.find({ username: new RegExp("^" + req.body.name.trim() + "$") }, (err, users) => {
                disconnectFromDatabase();
                
                if (err) return res.send({ error: "A database error occurred querying the users!" });
                
                res.send({ available: (users.length === 0) });
            });
        });

    app.route("/user/:userID/update")
        .post((req, res, next) => {
            if (req.params.userID != parseInt(req.params.userID))
                return next();

            var sessionUser = req.session.user || null;
            
            // Make sure the user is changing their own information
            if (!sessionUser || sessionUser._id != req.params.userID)
                return res.send({error: "You can only modify your own user profile"});
                
            // Make sure the new name isn't blank
            if (!req.body.displayName || req.body.displayName.trim() == "")
                return res.send({error: "The display name cannot be blank"});
                
            connectToDatabase();
            
            // Update the display name
            User.findOneAndUpdate({ _id: req.params.userID }, { displayName: req.body.displayName }, (err) => {
                disconnectFromDatabase();
                
                if (err) return res.send({error: "Error finding the user information"});
                
                sessionUser.displayName = req.body.displayName;
                
                return res.send({success: "Your name has been changed"});
            });
        });

    app.route("/user/:userID")
        .get((req, res, next) => {
            if (req.params.userID != parseInt(req.params.userID))
                return next();

            var sessionUser = req.session.user || null;
            if (!sessionUser)
                res.render("index", { message: { type: "alert-warning", message: "You must be logged in to view your user profile." } });
            else if (sessionUser._id == req.params.userID)    // If the page is for the current user, display an editable profile, otherwise display a static profile
                res.render("userprofile", { user: sessionUser });
            else
                res.redirect("/vote/user/" + sessionUser._id);
        });

    app.route("*")
        .get((req, res) => {
            res.status(404).render("404", { user: (req.session.user || null) });
        });
        
    function addResponse(req, res, answer) {
        var response = new Response({
            poll: answer.poll,
            answer: answer._id,
            user: (req.session.user ? req.session.user._id : null),
            ip: (req.session.user ? null : req.ip)
        });
        response.save((err) => {
            disconnectFromDatabase();
            
            if (err) return res.send({ error: "A database error occurred!" });
            
            res.send({ success: true });
        });
    }
        
    function queryAnswers(req, res) {
        
        Poll.findOne({ _id: req.params.pollID }, (err, poll) => {
            if (err) {
                disconnectFromDatabase();
                return res.send({ error: "A database error occurred" });
            }

            // Find all of the answer options for this poll
            Answer.find({ poll: poll._id }).sort({ order: "asc" }).exec((err, docs) => {
                if (err) {
                    disconnectFromDatabase();
                    return res.send({ error: "A database error occurred" });
                }

                // Return if there are no answers
                if (docs.length === 0) {
                    disconnectFromDatabase();
                    return res.send({ error: "No answers have been defined yet" });
                }
                
                // Get the user ids of whoever added the answer
                var userIDs = [];
                docs.forEach((d) => {
                    if (userIDs.indexOf(d.user) == -1)
                        userIDs.push(d.user);
                });                      
                    
                // Get the display names for all of the users who have added answers
                User.find({ _id: { $in: userIDs }}, (err, users) => {
                    disconnectFromDatabase();
                    if (err) return res.send({ error: "A database error occurred" });

                    // Return the users, answers, and poll author to be proceessed
                    // by the AJAX success function.  canAdd indicates if the user
                    // is able to add answers to the poll (and is thus logged in)
                    // on the single poll page.
                    res.send({ users: users, answers: docs, author: poll.user, canAdd: (req.session.user ? req.session.user._id : 0) });
                });
            });
        });
    }

    function connectToDatabase() {
        if (connection)
            disconnectFromDatabase();
            
        connection = mongoose.connect(process.env.VOTE_DB);
        autoincrement.initialize(connection);
        
        if (!User) {
            User = require(baseDir + "/app/models/users.js")(autoincrement);
            Poll = require(baseDir + "/app/models/polls.js")(autoincrement);
            Answer = require(baseDir + "/app/models/answers.js")(autoincrement);
            Response = require(baseDir + "/app/models/responses.js")(autoincrement);
        }
    }
    
    function disconnectFromDatabase() {
        if (!connection)
            return;
            
        connection.disconnect();
        connection = null;
    }
};