const express = require("express")
const router = express.Router()
//const passport = require("passport")

const User = require("../models/user.model")


const connectionChecker = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'You need to login' })

router.get('/', connectionChecker, (req, res) => {

    const userId = req.user.id

    User
        .findById(userId)
        .populate('courses')
        .populate('meetups')
        .then(response => res.render('profile/profile', { response, isTeach: req.user.role.includes('TEACH'), isAlumni: req.user.role.includes('ALUM')}))


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
        .then(() => res.redirect ('/profile'))
        .catch(err => next(new Error(err)))

})

module.exports = router