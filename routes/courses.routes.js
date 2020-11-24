const express = require("express")
const router = express.Router()

const Course = require("../models/course.model")

const User = require('./../models/user.model')

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })
const roleChecker = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() :  res.redirect('/courses') //TO DO

router.get('/', (req, res, next) => {


    Course
        .find({ active: true })
        .then(response => {

            if (req.isAuthenticated()) {

                const isTeach = req.user.role.includes('TEACH')

                const isOwner = response.filter(elm => elm.teacher[0] == req.user.id)

                const notOwner = response.filter(elm => elm.teacher[0] != req.user.id)

                res.render('courses/courses-index', { isOwner, notOwner, isTeach })

            } else {

                res.render('courses/courses-index', { response })

            }
        })

        .catch(err => next(new Error(err)))
})

router.get('/new', (req, res, next) => res.render('courses/new-course'))

router.post('/new', (req, res, next) => {

    const { name, style, description, date, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Course
        .create({ name, style, description, date, location, teacher: req.user.id })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))

})

router.get('/edit/:course_id', (req, res, next) => {

    const courseId = req.params.course_id

    Course
        .findById(courseId)
        .then(response => res.render('courses/edit-course', response))
        .catch(err => next(new Error(err)))

})

router.post('/edit/:course_id', (req, res, next) => {

    const courseId = req.params.course_id

    let { name, style, description, date, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Course
        .findByIdAndUpdate(courseId, { name, style, description, date, location }, { new: true })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))
})

router.post('/cancel/:course_id', (req, res, next) => {

    const courseId = req.params.course_id

    req.body = false

    Course
        .findByIdAndUpdate(courseId, { active: req.body }, { new: true })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))

})

router.post('/attend/:course_id', connectionChecker, roleChecker(['TEACH', 'ALUM']), (req, res, next) => {

    const courseId = req.params.course_id

    const userId = req.user.id

    User
        .findByIdAndUpdate(userId, { $push: { courses: courseId } }, { new: true })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))

})

module.exports = router