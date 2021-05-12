var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/userAcc')


var userFacebookSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    provider: String,
}, { collection: "users" })


module.exports = mongoose.model('fbUser', userFacebookSchema)