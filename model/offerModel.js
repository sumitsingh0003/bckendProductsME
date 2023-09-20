const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });
const bcrypt = require("bcryptjs");

var Offers = function (data) {};

Offers.addOffers = async function (postdata, offerMainImg) {
  return new Promise((resolve, reject) => {
    try {
      var insertdata = {
        title: postdata.title ? postdata.title : "",
        description: postdata.description ? postdata.description : "",
        startDate: postdata.startDate ? postdata.startDate : "",
        endDate: postdata.endDate ? postdata.endDate : "",
        links: postdata.links ? postdata.links : "",
        offerMainImg: offerMainImg ? offerMainImg : ""
      }; 
      var checkQuery = "SELECT title FROM tg_offers WHERE title = ?";
      db.query(checkQuery, [insertdata.title], (err, rows) => {
        if (err) {
          console.log(err, "ertu")
          return reject(err);
        }

        if (rows.length > 0) {
          return resolve("The offer is already exists");
        } else {
          
          var insertQuery = "INSERT INTO tg_offers SET ?";
          db.query(insertQuery, insertdata, (err, res) => {
            if (err) {
              console.log(err, "asdfghj")
              return reject(err);
            } else {
              console.log("The offer created successfully", res);
              return resolve(res);
            }
          });
        }
      });
    } catch (error) {
      console.log(error, "wertyui")
      reject(error);
    }
  });
};

Offers.delOffer = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("Category ID is missing");
    }
    const offersId = postdata.id;
    const queryString = "DELETE FROM tg_offers WHERE id = ?";
    const filter = [offersId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error deleting Offers:", err);
        return reject(err);
      } else {
        if (res.affectedRows === 0) {
          return reject("Data was not found");
        }
        return resolve(res);
      }
    });
  });
};

Offers.changeOffersData = async function (postdata) {
  return new Promise(async (resolve, reject) => {
    const { id, title, description, startDate, endDate, links } = postdata;

    db.query( "UPDATE tg_offers SET title=?, description=?, startDate=?, endDate=?, links=? WHERE id=?",[title, description, startDate, endDate, links, id],
      (err, res) => {
        if (err) {
          return reject(err);
        } else {
          db.query( "SELECT * FROM tg_offers WHERE id = ?", [id], (err, updatedUser) => {
              if (err) {
                return reject(err);
              } else {
                return resolve(updatedUser);
              }
            }
          );
        }
      }
    );
  });
};


// Products.addBrand = async function (postdata) {
//   return new Promise((resolve, reject) => {
//     try {
//       var insertdata = {
//         brand_name: postdata.brand_name ? postdata.brand_name : "",
//       }; 
//       var checkQuery = "SELECT brand_name FROM tg_product_brand WHERE brand_name = ?";
//       db.query(checkQuery, [insertdata.brand_name], (err, rows) => {
//         if (err) {
//           console.log(err, "ertu")
//           return reject(err);
//         }

//         if (rows.length > 0) {
//           return resolve("Brand already exists");
//         } else {
          
//           var insertQuery = "INSERT INTO tg_product_brand SET ?";
//           db.query(insertQuery, insertdata, (err, res) => {
//             if (err) {
//               console.log(err, "asdfghj")
//               return reject(err);
//             } else {
//               console.log("Brand added successfully", res);
//               return resolve(res);
//             }
//           });
//         }
//       });
//     } catch (error) {
//       console.log(error, "wertyui")
//       reject(error);
//     }
//   });
// };

// Products.deletedBrands = async function (postdata) {
//   return new Promise((resolve, reject) => {
//     if (!postdata || !postdata.id) {
//       return reject("Brands ID is missing");
//     }
//     const userId = postdata.id;
//     const queryString = "DELETE FROM tg_product_brand WHERE id = ?";
//     const filter = [userId];

//     db.query(queryString, filter, function (err, res) {
//       if (err) {
//         console.error("Error deleting Brand:", err);
//         return reject(err);
//       } else {
//         if (res.affectedRows === 0) {
//           return reject("Data was not found");
//         }
//         return resolve(res);
//       }
//     });
//   });
// };

  
module.exports = Offers;
