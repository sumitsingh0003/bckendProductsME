const mime = require('mime');
const fs = require("fs");
const path = require("path");
var moment = require('moment');

var base64ToSingleFilePath = () => {
    
}


base64ToSingleFilePath.base64ToImage = async function (productImg) {
    return new Promise(function (resolve, reject) {
        // console.log(postData, "Single Img")
        var monthYear = moment(new Date()).format('YYYY-MM');
        var uploadDir = `public/uploads/${monthYear}/`;
        var uploadPath = `uploads/${monthYear}/`;
        
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        
        if (productImg == '') {
            return;
        }
        // to declare some path to store your converted image
        var matches = productImg.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
        response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let type = decodedImg.type;
        let extension = mime.getExtension(type);
        let fileName = `${Date.now()}.` + extension;
        
        try {
            fs.writeFileSync(uploadDir + fileName, imageBuffer, 'utf8');
            var data = {
                fileName  : uploadPath + fileName,
                Location : 'http://localhost:3001/' +uploadPath + fileName,
                uploadPath : uploadPath + fileName
            };
            resolve(data)
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}


base64ToSingleFilePath.removebase64image = async function (postData) {

    return new Promise(function (resolve, reject) {
        var directoryPath = `public/`;
        var fileName = postData.filename;
        try {
            fs.unlinkSync(directoryPath + fileName);
            resolve({ fileName })
        } catch (err) {
            console.log(err)
            resolve(err)
        }
    })
    
}
module.exports = base64ToSingleFilePath;