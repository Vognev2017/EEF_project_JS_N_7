const express = require('express');
const routerA = express.Router();
bodyParser = require('body-parser');
const path = require('path')
const multer = require('multer')
const jsonParser = express.json();
const {
    getUser
} = require('../db/users');
const {
    getAllUsers
} = require('../db/users');
const {
    getUserById
} = require('../db/users');
const {
    getPhotoAlbumByUser
} = require('../db/utils');
const {
    addNewAlbum
} = require('../db/utils');
const {
    existAlbum
} = require('../db/utils');
const {
    updateAlbum
} = require('../db/utils');


const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, (Date.now() + path.extname(file.originalname)));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})


function auth(req, res) {
    const {
        pass
    } = req.body;
    const user = getUser(pass);
    const userAlbum = getPhotoAlbumByUser(user.id)
    let id;
    let name;
    let title = null;
    let photos = null;
    if (user != null) {
        if (userAlbum != null) {
            if (userAlbum[0].length > 0) {
                title = userAlbum[0];
                photos = userAlbum[1];
            }
        }
        id = user.id
        name = user.name
        res.render("user-page", {
            name,
            title,
            photos,
            id
        });
    } else {
        res.status(404).render('error/error', {
            title: "Sorry, page not found",
            image: "/img/404.png"
        });
    }
}


routerA.use('/login', bodyParser.urlencoded({
    extended: true
}));


routerA.get('/user/:user_id', (req, res, next) => {
    const {
        id,
    } = req.params;
    let title;
    let photos;

    const userAlbum = getPhotoAlbumByUser(user_id)

    if (userAlbum != null) {
        title = userAlbum[0];
        photos = userAlbum[1];
    }
    res.render("user-page", {
        id,
        title,
        photos
    });
});

routerA.get('/upload-page/:id', (req, res) => {
    const {
        id
    } = req.params;
    let titles;

    const userAlbum = getPhotoAlbumByUser(id);

    if (userAlbum != null) {
        titles = userAlbum[0];
    }

    res.render("upload-page", {
        id,
        titles
    })
});


routerA.post('/login', auth);


routerA.post('/upload/', upload.fields([{
    name: "myImage",
    maxCount: 5
}]), function (req, res, next) {
    try {
        let filedata = req.files.myImage;

        const {
            id,
            title
        } = req.body;

        const existAlboom = existAlbum(id, title);

        if (existAlboom !== "0") {

            updateAlbum(existAlboom, filedata)

        } else {
            const user = getUserById(id);

            const newAlb = {
                "name": user.name,
                "userId": user.id,
                "title": title,
                "filedata": filedata
            };

            addNewAlbum(newAlb)
        }
        res.status(200).send("File upload")
    } catch (error) {
        res.sendStatus(500);
    }
});

routerA.get('/list-user', (req, res) => {

    const users = getAllUsers()
    console.log("users", users)
    res.render('admin-page', {
        users
    });
});

module.exports = routerA;