//by Edwin
var passport = require('passport')
require('../app.js')
var User = require('../data/ggUser')
var google = require('passport-google-oauth2').Strategy

passport.serializeUser(function(user, done) {
    done(null, user)
        //From the user take just the id and just pass the id of the usert o the done callback
})

passport.deserializeUser(function(user, done) {
    user.findById(id, function(id, done) {
            done(null, user)
        })
        //deserializeUser corresponds to the user object provided to the done function. 
        //So this can retrieve the entire object. The key here is the user ID (the key can be any key of the user object, 
        //ie name, email, etc.). deserializeUser matches the database.
})

passport.use(new google({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL, //get info from .env
    passReqToCallback: true
}, function(req, accessToken, refreshToken, profile, done) {

    console.log(profile)

    process.nextTick(function() {
        // find the user in the database based on id
        User.findOne({ 'uid': profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err)
                    // if the user is found, then log in
            if (user) {
                console.log("user found")
                console.log(user)
                return done(null, user) // user found, return that user
            } else {
                // if there is no user found with thatid, create new user
                var newUser = new User()
                    // set all of the information in our user model
                newUser.uid = profile.id // set the users id                                      
                    //newUser.name = profile.name.givenName + ' ' + profile.name.familyName
                newUser.name = profile.displayName // set the users name
                newUser.email = profile.emails[0].value //  set the users emails
                newUser.provider = profile.provider //set the account provider
                    // save user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err

                    // if successful, return the new user
                    return done(null, newUser)
                })
            }

        })

    })

}))