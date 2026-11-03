const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "signed", "registered", "closed"],
        default: "draft"
    },
    documents: [
        {
            title: { type: String },
            url: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Deal", dealSchema);
