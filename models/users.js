// Importing mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var userSchema = new Schema({
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    username: { type: String, default: '' }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("USER", userSchema);


