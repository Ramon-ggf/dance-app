const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    style: {
        type: String,
        enum: ['Salsa casino', 'Bachata', 'Hip-hop', 'Afrobeats', 'Tango', 'Twist', 'Flamenco', 'Sevillanas', 'Reggeaton', 'Twerk', 'Funky', 'Zumba', 'Dancehall'],
        required: true
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
    teacher: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, {

    timestamps: true

})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course