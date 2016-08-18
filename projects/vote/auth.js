"use strict";

// Set authoriaztion keys for Facebook and Twitter
// based on the environment values loaded by the
// dotenv module.

module.exports = {
    facebook: {
        appID: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
        appCallback: process.env.VOTE_APP_URL + "/auth/facebook/callback"
    },
    
    twitter: {
        appID: process.env.TWITTER_APP_ID,
        appSecret: process.env.TWITTER_APP_SECRET,
        appCallback: process.env.VOTE_APP_URL + "/auth/twitter/callback"
    }
}