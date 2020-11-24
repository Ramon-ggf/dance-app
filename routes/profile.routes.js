const express = require("express")
const router = express.Router()

const User = require("../models/user.model")
const Course = require("../models/course.model")
const Meetup = require("./../models/meetup.model")

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/', connectionChecker, (req, res, next) => {

    const userId = req.user.id

    const coursePromise = Course.find({ teacher: userId })
    const userPromise = User.findById(userId).populate('courses').populate('meetups')
    //const meetupPromise = 

    Promise.all([coursePromise, userPromise])
        .then(response => res.render('profile/profile', { courses: response[0], user: response[1], isTeach: req.user.role.includes('TEACH'), isAlumni: req.user.role.includes('ALUM')}))
        .catch(err => next(new Error(err)))

})

router.get('/edit', (req, res, next) => {

    res.render('profile/profile-edit', { user: req.user, isTeach: req.user.role.includes('TEACH') })

})

router.post('/edit/:user_id', (req, res, next) => {

    let { name, lastname, email, password, role } = req.body

    const userId = req.params.user_id

    if (role === undefined) {

        role = req.user.role

    }

    User
        .findByIdAndUpdate(userId, { name, lastname, email, password, role })
        .then(() => res.redirect('/profile'))
        .catch(err => next(new Error(err)))

})

module.exports = router