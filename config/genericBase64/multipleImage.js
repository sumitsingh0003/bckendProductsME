const mime = require('mime');
const fs = require("fs");
const path = require("path");
var moment = require('moment');

var base64ToFilePath = () => {
    
}


base64ToFilePath.base64ToImage = async function (postData) {
    return new Promise(function (resolve, reject) {
        console.log("1")
        var monthYear = moment(new Date()).format('YYYY-MM');
        var uploadDir = `public/uploads/${monthYear}/`;
        var uploadPath = `uploads/${monthYear}/`;
        console.log("2")
       
        if (!fs.existsSync(uploadDir)){
            console.log("3")
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        if (postData.base64 == '') {
            return;
        }
        
        console.log("4")
        var base64String = postData.base64 ? postData.base64 : '';
        console.log("5")
        // var base64Data = Buffer.from(base64String.replace(/^data:video\/\w+;base64,/, ""),'base64');
        var fileType = base64String.split(';')[0].split('/')[1];
        console.log("6")
        const format = base64String.substring(base64String.indexOf('data:')+5, base64String.indexOf(';base64'));
        console.log("7")
        console.log('fileType',fileType);
        // console.log('base64String',base64String);
        
        if(fileType == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            fileType = 'xlsx';
        }
        if(fileType == 'vnd.ms-exce'){
            fileType = 'xls';
        }
        if(fileType == 'plain'){
            fileType = 'csv';
        }
        
        console.log('fileType',fileType);
        // console.log('format',format);
        var getFileTypeValue = format.split('/')[0];
        console.log('getFileTypeValue',getFileTypeValue);
        
        if(getFileTypeValue == 'video'){
            var base64Data = Buffer.from(base64String.replace(/^data:video\/\w+;base64,/, ""),'base64');
        }else if(getFileTypeValue == 'application'){
            // console.log('else if');
            // var base64Data = Buffer.from(base64String.replace(/^data:application\/\w+;base64,/, ""),'base64');
            var base64Data = base64String.split(';base64,').pop();
        }else{
            // console.log('else');
            var base64Data = Buffer.from(base64String.replace(/^data:image\/\w+;base64,/, ""),'base64');
        }
        // to declare some path to store your converted image
        // var matches = postData.base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
        response = {};
        // if (matches.length !== 3) {
        //     return new Error('Invalid input string');
        // }
        // console.log('base64Data',base64Data);
        // fs.writeFile('image.xlsx', base64Data, {encoding: 'base64'}, function(err) {
        //     console.log('File created');
        // });        
        response.type = fileType;
        response.data = new Buffer.from(base64Data, 'base64');
        
        // console.log('response',response);
        // return false;
        
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let extension = fileType;
        let fileName = `${Date.now()}.` + extension;
        
        try {
            fs.writeFileSync(uploadDir + fileName, imageBuffer, 'utf8');
            var data = {
                fileName  : uploadPath + fileName,
                Location : process.env.IMAGE_UPLOAD_PATH+uploadPath + fileName,
                uploadPath : uploadPath + fileName
            };
            resolve(data)
        } catch (err) {
            console.log(err)
            reject(err)
        }
    })
}


base64ToFilePath.removebase64image = async function (postData) {
    
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
module.exports = base64ToFilePath;