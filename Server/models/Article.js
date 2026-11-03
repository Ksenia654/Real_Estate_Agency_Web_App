const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('articles', ArticleSchema);