const mongoose = require('mongoose')
const Schema = mongoose.Schema

const meetupSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String
        },
        coordinates: [Number]
    },
    owner: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            sparse: true
        }
    ],
    active: {
        type: Boolean,
        default: true
    }
}, {

    timestamps: true

})

const Meetup = mongoose.model('Meetup', meetupSchema)

module.exports = Meetup