const express = require("express")
const router = express.Router()
//const passport = require("passport")

const Course = require("../models/course.model")


router.get('/', (req, res, next) => {

    Course
        .find({ active: true })
        .then(response => {

            if (req.isAuthenticated()) {

                // let isOwner = []

                // response.forEach(elm => {

                //     if (req.user.id == elm.teacher[0]) {
                        
                //         isOwner.push(elm)
                        
                //     }
                    
                // })

                //console.log(isOwner)

                res.render('courses/courses-index', { response, isTeach: req.user.role.includes('TEACH')})
           
            } 
                
                res.render('courses/courses-index', { response })

            
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

module.exports = router