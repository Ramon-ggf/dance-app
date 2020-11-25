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
    img: {
        type: String,
        default: 'https://blog.netsarang.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'
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
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Course",
            sparse: true
        }
    ],
    meetups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Meetup",
            sparse: true
        }
    ]

}, {

    timestamps: true

})

const User = mongoose.model('User', userSchema)

module.exports = User