const express = require("express")
const router = express.Router()

const cloudUpload = require("./../configs/uploads.config")

const User = require("../models/user.model")
const Course = require("../models/course.model")
const Meetup = require("./../models/meetup.model")
const Picture = require("./../models/picture.model")

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/', connectionChecker, (req, res, next) => {

    const userId = req.user.id

    const coursePromise = Course.find({ teacher: userId, active: true })
    const userPromise = User.findById(userId).populate('courses').populate('meetups')
    const meetupPromise = Meetup.find({ owner: userId, active: true })

    Promise.all([coursePromise, userPromise, meetupPromise])
        .then(response => {

            console.log(response)

            let emptyTeachCourse = false
            let emptyLeadMeetup = false
            let emptyCourses = false
            let emptyMeetups = false

            if (response[1].courses.length === 0) {
                
                emptyCourses = true

            }

            if (response[1].meetups.length === 0) {
                
                emptyMeetups = true

            }

            if (req.user.role.includes('TEACH') && response[0].length === 0) {
                
                emptyTeachCourse = true

            }

            if (response[2].length === 0) {

                emptyLeadMeetup = true

            }
            
            res.render('profile/profile', { courses: response[0], user: response[1], meetupsOwner: response[2], isTeach: req.user.role.includes('TEACH'), isAlumni: req.user.role.includes('ALUM'), emptyTeachCourse, emptyLeadMeetup, emptyCourses, emptyMeetups })
        })
            
        .catch(err => next(new Error(err)))

})

router.get('/edit', (req, res, next) => {

    res.render('profile/profile-edit', { user: req.user, isTeach: req.user.role.includes('TEACH')})

})


router.post('/edit/profile-picture', connectionChecker, cloudUpload.single('img'), (req, res, next) => {


    const userId = req.user.id

    const picturePromise = Picture.create({ path: req.file.path, originalName: req.file.originalname })
    const userPromise = User.findByIdAndUpdate(userId, { img: req.file.path })

    Promise.all([picturePromise, userPromise])
        .then(() => res.redirect('/profile'))
        .catch(err => next(new Error(err)))

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