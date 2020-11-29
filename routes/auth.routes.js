const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

//--------------------------------SIGNUP PATH---------------------------------------------------------

router.get('/signup', (req, res, next) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {


    const { name, lastname, email, password, role } = req.body

    User
        .findOne({ email }, {email: 1})
        .then(response => {

            if (response) {
                res.render('auth/login', { errorMsg: 'This user is already registered' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)


            User
                .create({ name, lastname, email, password: hashPass, role })
                .then(() => res.redirect('/login'))
                .catch(err => next(new Error(err)))
        })

})

//--------------------------------LOGIN PATH---------------------------------------------------------

router.get('/login', (req, res, next) => res.render("auth/login", { errorMsg: req.flash("error") }))

router.post('/login', passport.authenticate("local", {

    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true

}))

router.get('/logout', (req, res) => req.session.destroy((err) => res.redirect("/")))

module.exports = router