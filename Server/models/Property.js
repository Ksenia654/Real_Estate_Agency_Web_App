const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    images: {
        type: [String],
        default: []
    },

    imageUrl: {
        type: String,
        default: null
    },
    price: {
        type: mongoose.Decimal128,
        default: 0.00
    }
}, { timestamps:true });

module.exports = mongoose.model('Property', PropertySchema);
