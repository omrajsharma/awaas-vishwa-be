const mongoose = require('mongoose');

const EnquiryMailSchema = new mongoose.Schema({
    propertyAdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PropertyAd",
        required: true
    },
    sendersId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    timestamps: true
})

module.exports = mongoose.model("EnquiryEmail", EnquiryMailSchema);