const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    postNameUrl: {
        type: String,
    },
    awsUrl: {
        type: String,
        default: ''
    },

})

module.exports = mongoose.model('Post', postSchema);