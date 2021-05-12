var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/userAcc')

var userGoogleSchema = mongoose.Schema({
    uid: String,
    name: String,
    email: String,
    provider: String,
}, { collection: "users" })


module.exports = mongoose.model('ggUser', userGoogleSchema)