const mongoose = require('mongoose');

const kindSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('theKind', kindSchema)