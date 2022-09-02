const fs = require("fs");
const filePath = 'photo_project.json';


const getPhotoAlbumByUser = (user_id) => {
    let result = []

    let photos = readMyFile();

    if (photos.length > 0) {
        let title = [];
        let photoList = [];

        for (let i = 0; i < photos.length; i++) {

            if (photos[i].userId == user_id) {

                const img = photos[i].img
                title.push(photos[i].title)

                for (let i1 = 0; i1 < img.length; i1++) {
                    let im = img[i1]
                    let ph = {
                        "title": photos[i].title,
                        "imgId": img[i1].imgId,
                        "img": img[i1].name
                    }
                    photoList.push(ph)
                }
            }
        }
        result.push(title)
        result.push(photoList)
        return result
    }
    return null;
}


const getPhotoAlbumByName = (title) => {

    let photos = readMyFile();

    if (photos.length > 0) {
        let photoList = [];

        for (let i = 0; i < photos.length; i++) {

            if (photos[i].title == title) {

                const img = photos[i].img;

                for (let i1 = 0; i1 < img.length; i1++) {
                    let im = img[i1]
                    let ph = {
                        "title": photos[i].title,
                        "imgId": img[i1].imgId,
                        "img": img[i1].name
                    }
                    photoList.push(ph);
                }
            }
        }
        return photoList
    }
    return null;
}


const getAllLinks = () => {
    let result = []
    let photos = readMyFile();

    if (photos.length > 0) {

        for (let i = 0; i < photos.length; i++) {
            let link = {
                "name": photos[i].title,
                "link": photos[i].link
            }
            result.push(link)
        }
        return result;
    }
    return null;

}


const getAllImage = () => {
    let result = []
    let linkList = []
    let photoList = []
    let photos = readMyFile();

    if (photos.length > 0) {

        for (let i = 0; i < photos.length; i++) {

            const img = photos[i].img
            let link = {
                "name": photos[i].title,
                "link": photos[i].link
            }
            linkList.push(link)
            for (let i1 = 0; i1 < img.length; i1++) {
                let im = img[i1]
                let ph = {
                    "title": photos[i].title,
                    "imgId": img[i1].imgId,
                    "img": img[i1].name
                }
                photoList.push(ph)
            }

        }
        result.push(linkList)
        result.push(photoList)
        return result
    }
    return null;
}

function getMaxId() {
    let photos = readMyFile();

    if (photos.length > 0) {
        const id = Math.max.apply(Math, photos.map(function (o) {
            return o.id;
        }))
        return id;
    }
    return 0;
}

function addNewAlbum(newAlb) {
    let photos = readMyFile();

    const maxId = getMaxId() + 1;
    const img = getFileArr(maxId, newAlb.filedata);
    const newAlbum = {
        "id": maxId,
        "userId": newAlb.userId,
        "name": newAlb.name,
        "title": newAlb.title,
        "link": "/album/" + newAlb.title,
        "img": img
    }
    photos.push(newAlbum);
    writeMyFile(photos);
}

function existAlbum(id, title) {
    let photos = readMyFile();

    if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
            if (photos[i].userId == id && photos[i].title == title) {
                return photos[i].id.toString()
            }
        }
    }
    return "0"
}

function updateAlbum(albumId, filedata) {

    let albumDB;
    let photos = readMyFile();

    for (var i = 0; i < photos.length; i++) {
        if (photos[i].id == albumId) {
            albumDB = photos[i];
            break;
        }
    }
    let imgNew = getFileArr(albumId, filedata, albumDB.img.length);

    const newImgArray = [...albumDB.img, ...imgNew];
    albumDB.img = newImgArray;

    data = JSON.stringify(photos);
    fs.writeFileSync('photo_project.json', data);
}

function getFileArr(id, filedata, imgId = 0) {
    let filesArray = []

    let idIm = id.toString();

    for (let i = 0; i < filedata.length; i++) {

        let tempId = idIm + (i + 1 + imgId);

        let im = {
            imgId: tempId,
            name: "/uploads/" + filedata[i].filename
        }

        filesArray.push(im);
    }
    return filesArray;
}

function readMyFile() {
    let photos = []
    try {
        const content = fs.readFileSync(filePath, "utf8");
        photos = JSON.parse(content);

    } catch (error) {
        console.log("error: ", error)
    }
    return photos;
}

function writeMyFile(photos) {
    data = JSON.stringify(photos);

    fs.writeFileSync(filePath, data);
}
module.exports = {
    getPhotoAlbumByUser,
    getPhotoAlbumByName,
    getAllLinks,
    getAllImage,
    addNewAlbum,
    existAlbum,
    updateAlbum
}