const express = require('express');
const server = express();


server.set('view engine', 'ejs')
server.set('views', './views')

const mainRouter = require('./routers/rout');
const adminRouter = require('./routers/admin');

server.use(express.static('./public'));

server.use('/admin', adminRouter);
server.use('/', mainRouter);

server.use((err, req, res, next) => {

    res.status(500).render('error/error', {
        title: "Sorry. Server error",
        image: "/img/500.png"
    });
    next();
});

server.use((req, res) => {
    res.status(404).render('error/error', {
        title: "Sorry, page not found",
        image: "/img/404.png"
    });
});

server.listen(3000)