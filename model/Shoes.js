const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shoeSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true
    },
    theLoai: {
        type: Schema.Types.ObjectId,
        ref: "theKind",
        required: true
    },
    gia: {
        type: String,
        default: '0'
    },
    status: {
        type: [{
            type: String,
            enum: ['true', 'false']
        }],
        default: ['true']
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('shoes', shoeSchema)