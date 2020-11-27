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
    image: {
        type: String,
        default: 'https://blog.netsarang.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png'
    },
    date: {
        type: String,
        required: true
    },
    address: String,
    teacher: [
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

const Course = mongoose.model('Course', courseSchema)

module.exports = Course