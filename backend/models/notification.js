const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    message:{type:String},
    messageScope:{type:String},
    userId:{type:String},
    date: {type:String},
    time:{type:String},
    venue:{type:String},
}, { capped: { max: 10 } });

module.exports = mongoose.model("Notification", notificationSchema);
