//by Edwin
var passport = require('passport')
var User = require('../data/fbUser')
var facebook = require('passport-facebook').Strategy
require('../app.js')

passport.serializeUser(function(user, done) {
    done(null, user)
        //From the user take just the id and just pass the id of the usert o the done callback
})

passport.deserializeUser(function(user, done) {
        user.findById(id, function(id, done) {
            done(null, user)
        })
    }) //deserializeUser corresponds to the user object provided to the done function. 
    //So this can retrieve the entire object. The key here is the user ID (the key can be any key of the user object, 
    //ie name, email, etc.). deserializeUser matches the database.

passport.use(new facebook({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL, //get info from .env
    profileFields: ['id', 'displayName', 'name', 'email'],
    //passReqToCallback: true
}, function(token, refreshToken, profile, done) {

    console.log(profile)

    process.nextTick(function() {
        // find the user in the database based on id
        User.findOne({ 'id': profile.id }, function(err, user) {
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
                newUser.id = profile.id // set the users id   
                newUser.name = profile.displayName // set the users name                                   
                    //newUser.name = profile.name.givenName + ' ' + profile.name.familyName // set the users name
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