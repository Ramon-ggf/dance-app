const express = require("express")
const router = express.Router()
//const passport = require("passport")

const Course = require("../models/course.model")

const User = require('./../models/user.model')

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/',  (req, res, next) => {

    Course
        .find({ active: true })
        .then(response => {

             if (req.isAuthenticated()) {

                 const isTeach = req.user.role.includes('TEACH')

            //     // let isOwner = []

            //     // response.forEach(elm => {

            //     //     if (req.user.id == elm.teacher[0]) {

            //     //         isOwner.push(elm)

            //     //     }

            //     // })

            //     //console.log(isOwner)

                 console.log(isTeach)

                 res.render('courses/courses-index', { response, isTeach })

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
        //.then(response => console.log(response))
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

router.post('/attend/:course_id', connectionChecker, (req, res, next) => {

    const courseId = req.params.course_id

    const userId = req.user.id

    User
        .findByIdAndUpdate(userId, { $push: { courses: courseId } }, { new: true })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))

})

module.exports = router