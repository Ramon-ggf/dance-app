const express = require("express")
const router = express.Router()

const Meetup = require('./../models/meetup.model')

const User = require('./../models/user.model')

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/', (req, res, next) => {

    Meetup
        .find({ active: true })
        .then(response => res.render('meetups/meetup-index', { response }))
        .catch(err => next(new Error(err)))
})

router.get('/new', (req, res, next) => res.render('meetups/new-meetup'))

router.post('/new', (req, res, next) => {

    const { name, description, date, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Meetup
        .create({ name, description, date, location })
        .then(() => res.redirect('/meetup'))
        .catch(err => next(new Error(err)))

})

router.get('/edit/:meetup_id', (req, res, next) => {

    const meetId = req.params.meetup_id

    Meetup
        .findById(meetId)
        .then(response => res.render('meetups/edit-meetup', response))
        .catch(err => next(new Error(err)))
})


router.post('/edit/:meetup_id', (req, res, next) => {

    const meetId = req.params.meetup_id

    const { name, description, date, latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }

    Meetup
        .findByIdAndUpdate(meetId, { name, description, date, location }, { new: true })
        .then(response => console.log(response))
        .catch(err => next(new Error(err)))
})

router.post('/cancel/:meetup_id', (req, res, next) => {

    const meetId = req.params.meetup_id

    req.body = false

    Meetup
        .findByIdAndUpdate(meetId, { active: req.body }, { new: true })
        .then(() => res.redirect('/meetup'))
        .catch(err => next(new Error(err)))

})

router.post('/attend/:meetup_id', connectionChecker, (req, res, next) => {

    const meetId = req.params.meetup_id

    const userId = req.user.id

    User
        .findByIdAndUpdate(userId, { $push: { meetups: meetId } }, { new: true })
        .then(response => console.log(response))
        .catch(err => next(new Error(err)))

})

module.exports = router