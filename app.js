//by Edwin
var express = require('express')
var passport = require('passport')
require('dotenv').config()
var verify = require("./Email_notification/verify") //Import verify.js
var app = express()
require('./passport/passport-google')
require('./passport/passport-facebook')
var ggUser = require('./data/ggUser')
var fbUser = require('./data/fbUser')
app.set("view engine", "ejs")
require('./Email_notification/verify')
var MongoClient = require('mongodb').MongoClient //import mongodb
var url = "mongodb://0.0.0.0:27017/grouptest"
var path = require("path")

//var session = require("express-session")


app.all("*", function(req, res, next) {
        //Set the domain name that allows cross-domain, * means that any domain name is allowed to cross-domain
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "content-type")
            //Cross-domain allowed request methods
        res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS")
        if (req.method.toLowerCase() == 'options')
            res.send(200)
        else
            next()
    }) //The purpose of cross-domain is to obtain resources on page B from page A, 
    //and the browser will check the HTTP header (HEAD request) of server B. If it meets the requirements, the browser will allow cross-domain
    //https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

//passport.initialize() middleware
app.use(passport.initialize())
    // app.use(passport.session())
    // app.use(session({ secret: "725G8" }))

//path way to index.ejs
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

//path way to success.ejs
app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/Screens/Welcome.html')
})

//path way to failed.ejs
app.get('/failed', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// Authenticate Routes
app.get('/facebook', passport.authenticate('facebook', { scope: 'email' }))

app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect page.
        res.redirect('/success')
    }
)


// Authenticate Routes
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        // Successful authentication, redirect page.
        res.redirect('/success')
    }
)

app.get('/submit', function(req, res) {
        MongoClient.connect(url, function(err, db) { //Connect mongoDB
            if (err) throw err //Prompt error
            var database = db.db("userAcc")
            database.collection("users").find("email").sort({ name: -1, provider: 1 }).toArray(function(err, result) {
                if (err) throw err
                console.log(result)
                if (result.length > 0) {
                    verify.sendMail(result[0].email, (err, msg) => {
                        if (err) {
                            console.log(err)
                            res.send('send failed!')
                        }
                    })
                    res.send('send success!')
                } else {
                    res.send('failed')
                }
                db.close()
            })
        })
    }) //Query email based on name and provider in the database and send emails


app.listen(8000, () => {
    console.log("Server is running")
})