const db = require("../config/db");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "./.env" });
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { clearScreenDown } = require("readline");

var Product = function (data) {};

Product.addCat = async function (postdata) {
  return new Promise((resolve, reject) => {
    try {
      var insertdata = {
        cat_name : postdata.cat_name ? postdata.cat_name : "",
      };
      var checkQuery =
        "SELECT cat_name FROM tg_product_category WHERE cat_name = ?";
      db.query(checkQuery, [insertdata.cat_name], (err, rows) => {
        if (err) {
          console.log(err, "ertu");
          return reject(err);
        }

        if (rows.length > 0) {
          return resolve("Category already exists");
        } else {
          var insertQuery = "INSERT INTO tg_product_category SET ?";
          db.query(insertQuery, insertdata, (err, res) => {
            if (err) {
              console.log(err, "asdfghj");
              return reject(err);
            } else {
              console.log("Category added successfully", res);
              return resolve(res);
            }
          });
        }
      });
    } catch (error) {
      console.log(error, "wertyui");
      reject(error);
    }
  });
};

Product.deletedCategory = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("Category ID is missing");
    }
    const userId = postdata.id;
    const queryString = "DELETE FROM tg_product_category WHERE id = ?";
    const filter = [userId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error deleting category:", err);
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

Product.addBrand = async function (postdata) {
  return new Promise((resolve, reject) => {
    try {
      var insertdata = {
        brand_name: postdata.brand_name ? postdata.brand_name : "",
      };
      var checkQuery =
        "SELECT brand_name FROM tg_product_brand WHERE brand_name = ?";
      db.query(checkQuery, [insertdata.brand_name], (err, rows) => {
        if (err) {
          console.log(err, "ertu");
          return reject(err);
        }

        if (rows.length > 0) {
          return resolve("Brand already exists");
        } else {
          var insertQuery = "INSERT INTO tg_product_brand SET ?";
          db.query(insertQuery, insertdata, (err, res) => {
            if (err) {
              console.log(err, "asdfghj");
              return reject(err);
            } else {
              console.log("Brand added successfully", res);
              return resolve(res);
            }
          });
        }
      });
    } catch (error) {
      console.log(error, "wertyui");
      reject(error);
    }
  });
};

Product.deletedBrands = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("Brands ID is missing");
    }
    const userId = postdata.id;
    const queryString = "DELETE FROM tg_product_brand WHERE id = ?";
    const filter = [userId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error deleting Brand:", err);
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



Product.addProduct = async function (postdata, mainImg) {
  return new Promise((resolve, reject) => {
    try {
            var insertdata = {
            cat_id: postdata.cat_id ? postdata.cat_id : "",
            brand_id: postdata.brand_id ? postdata.brand_id : "",
            title: postdata.title ? postdata.title : "",
            model: postdata.model ? postdata.model : "",
            price: postdata.price ? postdata.price : "",
            salePrice: postdata.salePrice ? postdata.salePrice : "",
            mainImg: mainImg ? mainImg : "",
          };
          var checkQuery = "SELECT title FROM tg_products WHERE title = ?";
          db.query(checkQuery, [insertdata.title], (err, rows) => {
            if (err) {
              console.log(err, "ertu");
              return reject(err);
            }
            if (rows.length > 0) {
              return resolve("Product already exists");
            } else {
              var insertQuery = "INSERT INTO tg_products SET ?";
              db.query(insertQuery, insertdata, (err, res) => {
                if (err) {
                  console.log(err, "asdfghj");
                  return reject(err);
                } else {
                  console.log("Product added successfully", res);
                  return resolve(res);
                }
              });
            }
          });
    } catch (error) {
      console.log(error, "wertyui");
      reject(error);
    }
  });
};
Product.addProductGallery = async function (product_id, imageData) {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(imageData)) {
        // If imageData is not an array, convert it into an array with a single element
        imageData = [imageData];
    }
    
      console.log("Model imageData:-", imageData)

      imageData.forEach((file) => {
        var queryString = "INSERT INTO tg_product_gallery (product_id, image_path) VALUES (?, ?)";
        var values = [product_id, file.fileName];

        db.query(queryString, values, function (err, res) {
          if (err) {
            console.error("Error:", err);
            return reject(err);
          } else {
            console.log("Inserted successfully.");
            resolve(res); // You can resolve with some data if needed.
          }
        });

      });

    } catch (error) {
      console.error("Error:", error);
      reject(error);
    }
  });
};
Product.deleteProductGallery = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("Product ID is missings");
    }
    const userId = postdata.id;
    const queryString = "DELETE FROM tg_product_gallery WHERE product_id = ?";
    const filter = [userId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error deleting Product:", err);
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
Product.deleteProduct = async function (postdata) {
  return new Promise((resolve, reject) => {
    if (!postdata || !postdata.id) {
      return reject("Product ID is missing");
    }
    const userId = postdata.id;
    const queryString = "DELETE FROM tg_products WHERE id = ?";
    const filter = [userId];

    db.query(queryString, filter, function (err, res) {
      if (err) {
        console.error("Error deleting Product:", err);
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
Product.changeProductData = async function (postdata, mainImg) {
  return new Promise(async (resolve, reject) => {
    var updatedvalues = {
      cat_id : postdata.cat_id ,
      brand_id : postdata.brand_id ,
      title : postdata.title ,
      model : postdata.model ,
      price : postdata.price ,
      salePrice : postdata.salePrice,
      mainImg: mainImg
    }
    // if(postdata.mainImg){
    //   updatedvalues.mainImg=postdata.mainImg
    // }
    console.log(updatedvalues)
    var queryString = "update tg_products set ? where id = ?"
    var filter = [updatedvalues , postdata.id]
    db.query(queryString , filter,function(err,res) {
      if(err){
        return reject(err)
      } 
      else {
        return resolve(res)
      }
    })
   
  });
};
Product.removeGalleryImages = async function (postdata) {
  return new Promise((resolve, reject) => {
    // console.log("postdata:-", postdata)

    if (!Array.isArray(postdata)) {
      postdata = [postdata];
    }
  
    postdata.forEach((file) => {
      console.log(file.id)
      var queryString = "DELETE FROM tg_product_gallery WHERE id = ?";
      var values = [file.id];

      db.query(queryString, values, function (err, res) {
        if (err) {
          console.error("Error:", err);
          return reject(err);
        } else {
          if (res.affectedRows === 0) {
            return reject("Data was not found");
          }
          console.log("Deleted successfully.");
          return resolve(res);
        }
      });
    });
  });
};


module.exports = Product;
