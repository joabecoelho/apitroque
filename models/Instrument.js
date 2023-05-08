const mongoose = require('mongoose')
const {Schema} = mongoose

const User = mongoose.model(
    'Instrument',
    new Schema(
    {
        name: {
            type: String,
            required: true
        },
        usageTime: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean
        },
        user: Object,
        changer: Object
    },
    { timestamps: true },
    ),
)
    

module.exports = User