const express = require("express")
const router = express.Router()

const Meetup = require('./../models/meetup.model')

const User = require('./../models/user.model')

const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/', (req, res, next) => {

    Meetup
        .find({ active: true })
        .then(response => {

            if (req.isAuthenticated()) {

                const isLogged = true

                const isOwner = response.filter(elm => elm.owner[0] == req.user.id)

                const notOwner = response.filter(elm => elm.owner[0] != req.user.id)

                res.render('meetups/meetup-index', { isOwner, notOwner, isLogged })

            } else {

                res.render('meetups/meetup-index', { response })
            }


        })
        .catch(err => next(new Error(err)))
})

router.get('/new', connectionChecker, (req, res, next) => res.render('meetups/new-meetup'))

router.post('/new', (req, res, next) => {

    const { name, description, date, address } = req.body

    Meetup
        .create({ name, description, date, address, owner: req.user.id })
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

    const { name, description, date, address } = req.body

    Meetup
        .findByIdAndUpdate(meetId, { name, description, date, address }, { new: true })
        .then(() => res.redirect('/meetup'))
        .catch(err => next(new Error(err)))
})

router.post('/cancel/:meetup_id', (req, res, next) => {

    const meetId = req.params.meetup_id

    req.body = false

    const meetupPromise = Meetup.findByIdAndUpdate(meetId, { active: req.body }, { new: true })
    const userPromise = User.updateMany({ meetups: meetId }, { $pull: { meetups: { $in: [meetId] } } }, { new: true })


    Promise.all([meetupPromise, userPromise])
        .then(() => res.redirect('/meetup'))
        .catch(err => next(new Error(err)))

})

router.post('/attend/:meetup_id', connectionChecker, (req, res, next) => {

    const meetId = req.params.meetup_id

    const userId = req.user.id



    User
        .findByIdAndUpdate(userId, { $push: { meetups: meetId } }, { new: true })
        .then(() => res.redirect('/meetup'))
        .catch(err => next(new Error(err)))

})

router.post('/cancelattend/:meetup_id', (req, res, next) => {

    const userId = req.user.id

    const meetId = req.params.meetup_id

    User
        .findByIdAndUpdate(userId, { $pull: { meetups: { $in: [meetId] } } }, { new: true })
        .then(() => res.redirect('/profile'))
        .catch(err => next(new Error(err)))

})

router.get('/:meetup_id', (req, res, next) => {

    const meetId = req.params.meetup_id

    const usersPromise = User.find({ meetups: meetId })
    const meetPromise = Meetup.findById(meetId)

    Promise.all([usersPromise, meetPromise])
        .then(response => res.render('meetups/details-meetup', { users: response[0], meetup: response[1] }))
        .catch(err => next(new Error(err)))

})

module.exports = router