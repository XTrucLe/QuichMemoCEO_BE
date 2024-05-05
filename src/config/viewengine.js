const express = require('express')
const path = require('path')
const ConfigViewEngine = (app) => {
    app.set('views', path.join('./src', 'views'))

    app.set('view engine', 'ejs')

    // config static file img/css/html
    // app.use(express.static('public'))
    app.use(express.static('./src/'))

}
module.exports = ConfigViewEngine;