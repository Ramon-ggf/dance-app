module.exports = app => {
    app.locals.siteTitle = 'Dance App'
    app.locals.APIkey = process.env.API
}
