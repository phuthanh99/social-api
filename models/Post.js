const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: 'string',
        required: true,
    },
    desc: {
        type: String,
        max: 50,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    }
},
    { timestamps: true },
    { typeKey: '$type' }
)

module.exports = mongoose.model('Post', PostSchema)