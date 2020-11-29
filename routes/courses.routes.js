const express = require("express")
const router = express.Router()

const cloudUpload = require("./../configs/uploads.config")

const Course = require("../models/course.model")
const Picture = require("./../models/picture.model")
const User = require('./../models/user.model')

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })
const roleChecker = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('roleError')

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

router.post('/search', (req, res, render) => {

    const style = req.body.styles

    console.log(style)

    if (style === 'none') {

        res.redirect('/courses')

    }

    Course
        .find({ active: true, style: style })
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

    const { name, style, description, date, address } = req.body

    console.log({ name, style, description, date, address })

    Course
        .create({ name, style, description, date, address, teacher: req.user.id })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))

})

router.post('/edit/course-picture/:course_id', connectionChecker, cloudUpload.single('image'), (req, res, next) => {

    const courseId = req.params.course_id

    const picturePromise = Picture.create({ path: req.file.path, originalName: req.file.originalname })
    const coursePromise = Course.findByIdAndUpdate(courseId, { image: req.file.path })

    Promise.all([picturePromise, coursePromise])
        .then(() => res.redirect(`/courses/${courseId}`))
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

    let { name, style, description, date, address } = req.body

    Course
        .findByIdAndUpdate(courseId, { name, style, description, date, address }, { new: true })
        .then(() => res.redirect('/courses'))
        .catch(err => next(new Error(err)))
})

router.post('/cancel/:course_id', (req, res, next) => {

    const courseId = req.params.course_id

    req.body = false

    const promiseCourse = Course.findByIdAndUpdate(courseId, { active: req.body }, { new: true })
    const userPromise = User.updateMany({ courses: courseId }, { $pull: { courses: { $in: [courseId] } } }, { new: true })

    Promise.all([promiseCourse, userPromise])
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

router.post('/cancelattend/:course_id', (req, res, next) => {

    const userId = req.user.id

    const courseId = req.params.course_id

    User
        .findByIdAndUpdate(userId, { $pull: { courses: { $in: [courseId] } } }, { new: true })
        .then(() => res.redirect('/profile'))
        .catch(err => next(new Error(err)))

})


router.get('/:course_id', (req, res, next) => {

    const courseId = req.params.course_id

    const coursePromise = Course.findById(courseId).populate('teacher')
    const userPromise = User.find({ courses: courseId })

    Promise.all([userPromise, coursePromise])
        .then(response => res.render('courses/details-course', { users: response[0], courses: response[1] }))
        .catch(err => next(new Error(err)))

})

module.exports = router