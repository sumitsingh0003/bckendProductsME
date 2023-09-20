var db = require("../config/db");
var offerModel = require("../model/offerModel");
var base64ToSingleFilePath = require("../config/genericBase64/singleImage");
const { check, validationResult, matchedData, oneOf, body } = require('express-validator');


exports.createOffers = async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const x = matchedData(req);
        return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
    }
    try {
        const {title, description, startDate, endDate, links, offerMainImg } = req.body
        var base64ToImage = await base64ToSingleFilePath.base64ToImage(offerMainImg);
        const allData = { title, description, startDate, endDate, links };
        db.beginTransaction()
        var data = await offerModel.addOffers(allData,  base64ToImage.fileName);
        if(data.insertId){
            db.commit();
            res.json({message: "The offer created successfully"})
        }else if("The offer is already exists"){
            db.rollback()
            res.status(404).json({message :"The offer is already exists"})
        }else{
            db.rollback()
            res.status(404).json({message :"failed to created offer data", Data : allData}  )
        }

    } catch (error) {
        db.rollback()
        console.log("error:-" , error)
        res.status(500).json({message : "operation failed" })
    }
}

exports.getAllOffers = async (req, res) => {
    try {
      db.query(
        "SELECT * FROM tg_offers ORDER BY id asc",
        function (err, data) {
          if (err) {
              res.status(500).send({ error: "Data not Found" });
          } else {
              res.status(200).send({ message: "All Offers Data", data });
          }
        }
      );
    } catch (error) {
      db.rollback();
      res.status(401).json({ error: "Data Error" });
    }
  };
  
exports.deletedOffers = async (req, res) => {
    try {
        db.beginTransaction()
        var deletedData = await offerModel.delOffer(req.body) 
        if(deletedData.affectedRows){
            db.commit();
            res.json({message: "Offers Deleted Successfull"})
        }else{
            db.rollback();
            res.status(401).json({error : "Datas Errorsssss"})
        }
    } catch (error) {
        db.rollback();
        res.status(401).json({ error: "Data Error" });
    }
}

exports.updatedOffersData = async (req, res) => {
    try {
        db.beginTransaction()
        var offersData = await offerModel.changeOffersData(req.body)
        if(offersData){
            db.commit()
            res.status(200).json({message: "Offers data has been changed successfull", data:offersData })
        }else{
            db.rollback();
            res.status(401).json({message: "This offer is not Found:"})
        }
    } catch (error) {
        db.rollback();
        res.status(401).json({ error: "Data Error" });
    }
}


// exports.addBrand = async function (req, res) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const x = matchedData(req);
//         return res.send({ message: 'Invalid Values', status: 'invalid', err: errors.mapped() });
//     }
//     try {
//         db.beginTransaction()
//         var data = await productsModel.addBrand(req.body);
//         if(data.insertId){
//             db.commit();
//             res.json({message: "Brand Add Successfull"})
//         }else if("Brand already exists"){
//             db.rollback()
//             res.status(404).json({message :"Brand name already exists"})
//         }else{
//             db.rollback()
//             res.status(404).json({message :"failed to insert data", Data : req.body}  )
//         }

//     } catch (error) {
//         db.rollback()
//         console.log("error:-" , error)
//         res.status(500).json({message : "operation failed" })
//     }
// }

// exports.getAllBrandData = async (req, res) => {
//     try {
//       db.query(
//         "SELECT * FROM tg_product_brand ORDER BY id asc",
//         function (err, data) {
//           if (err) {
//               res.status(500).send({ error: "Data not Found" });
//           } else {
//               res.status(200).send({ message: "All Brands Data", data });
//           }
//         }
//       );
//     } catch (error) {
//       db.rollback();
//       res.status(401).json({ error: "Data Error" });
//     }
// };

// exports.deleteBrandData = async (req, res) => {
//     try {
//         db.beginTransaction()
//         var deletedData = await productsModel.deletedBrands(req.body)
//         if(deletedData.affectedRows){
//             db.commit();
//             res.json({message: "Brands Deleted Successfull"})
//         }else{
//             db.rollback();
//             res.status(401).json({error : "Datas Errorsssss"})
//         }
//     } catch (error) {
//         if(error==="Data was not found"){
//             db.rollback()
//             res.status(404).json({message :"Data was not found"})
//         }
//         db.rollback();
//         res.status(401).json({ error: "Data Error" });
//     }
// }