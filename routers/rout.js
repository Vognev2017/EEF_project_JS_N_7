const express = require('express')
const router = express.Router()

const {
    getUser
} = require('../db/users');
const {
    getAllUsers
} = require('../db/users');
const {
    getAllLinks
} = require('../db/utils');
const {
    getAllImage
} = require('../db/utils');
const {
    getPhotoAlbumByName
} = require('../db/utils');


router.get('/', (req, res) => {
    const users = getAllUsers();
    const links = getAllLinks();

    res.render('index', {
        users,
        links
    });
});


router.get('/album', (req, res) => {
    const result = getAllImage()
    const links = result[0]
    const images = result[1]

    res.render('all-album', {
        links,
        images
    })
});


router.get('/order', (req, res) => {
    res.render("order")
});


router.get('/pay', (req, res) => {
    res.render("pay")
});


router.get('/album/:title', (req, res) => {
    const {
        title
    } = req.params;

    const images = getPhotoAlbumByName(title);

    res.render('album', {
        images
    })
});


module.exports = router;