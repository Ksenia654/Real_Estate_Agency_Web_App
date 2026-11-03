const mongoose = require("mongoose");

const TourSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "MyUser", required: true },
        propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
        access: { type: Boolean, default: true },
        scheduledAt: { type: Date },
    },
    { timestamps: true }
);

TourSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

module.exports = mongoose.model("Tour", TourSchema);
