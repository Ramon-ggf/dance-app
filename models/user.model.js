const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['TEACH', 'ALUM', 'GUEST'],
        default: 'GUEST'
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        unique: true
    }],
    meetups: [{
        type: Schema.Types.ObjectId,
        ref: 'Meetup',
        unique: true
    }]
}, {

timestamps: true

})

const User = mongoose.model('User', userSchema)

module.exports = User