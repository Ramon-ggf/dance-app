const express = require("express")
const router = express.Router()

const Course = require('./../models/course.model')
const Meetup = require('./../models/meetup.model')

router.get('/courses', (req, res, next) => {
    
    Course
        .find({ active: true })
        .then(courses => res.json(courses))
        .catch(err => next(new Error(err)))

})

router.get('/meets', (req, res, next) => {
    
    Meetup
        .find({ active: true })
        .then(meets => res.json(meets))
        .catch(err => next(new Error(err)))

})

module.exports = router