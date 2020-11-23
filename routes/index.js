module.exports = app => {

    // Base URLS
    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes.js'))
    app.use('/profile', require('./profile.routes.js'))
    app.use('/courses', require('./courses.routes.js'))
    app.use('/meetup', require('./meetup.routes.js'))
    app.use('/api', require('./api.routes.js'))
}