// Importing mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var feedSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "USER" },
    description: { type: String, default: "" },
    title: { type: String, default: "" },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("FEED", feedSchema);


