var db = require("../config/db");
var productsModel = require("../model/productsModel");
var base64ToFilePath = require("../config/genericBase64/multipleImage");
var base64ToSingleFilePath = require("../config/genericBase64/singleImage");
const {
  check,
  validationResult,
  matchedData,
  oneOf,
  body,
} = require("express-validator");


exports.addCategory = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const x = matchedData(req);
    return res.send({
      message: "Invalid Values",
      status: "invalid",
      err: errors.mapped(),
    });
  }
  try {
    db.beginTransaction();
    var data = await productsModel.addCat(req.body);
    if (data.insertId) {
      db.commit();
      res.json({ message: "Category Add Successfull" });
    } else if ("Category already exists") {
      db.rollback();
      res.status(404).json({ message: "Category name already exists" });
    } else {
      db.rollback();
      res
        .status(404)
        .json({ message: "failed to insert data", Data: req.body });
    }
  } catch (error) {
    db.rollback();
    console.log("error:-", error);
    res.status(500).json({ message: "operation failed" });
  }
};

exports.getAllCatData = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM tg_product_category ORDER BY id asc",
      function (err, data) {
        if (err) {
          res.status(500).send({ error: "Data not Found" });
        } else {
          res.status(200).send({ message: "All Category Data", data });
        }
      }
    );
  } catch (error) {
    db.rollback();
    res.status(401).json({ error: "Data Error" });
  }
};

exports.deleteCatData = async (req, res) => {
  try {
    db.beginTransaction();
    var deletedData = await productsModel.deletedCategory(req.body);
    if (deletedData.affectedRows) {
      db.commit();
      res.json({ message: "Category Deleted Successfull" });
    } else {
      db.rollback();
      res.status(401).json({ error: "Datas Errorsssss" });
    }
  } catch (error) {
    db.rollback();
    res.status(401).json({ error: "Data Error" });
  }
};



exports.addBrand = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const x = matchedData(req);
    return res.send({
      message: "Invalid Values",
      status: "invalid",
      err: errors.mapped(),
    });
  }
  try {
    db.beginTransaction();
    var data = await productsModel.addBrand(req.body);
    if (data.insertId) {
      db.commit();
      res.json({ message: "Brand Add Successfull" });
    } else if ("Brand already exists") {
      db.rollback();
      res.status(404).json({ message: "Brand name already exists" });
    } else {
      db.rollback();
      res
        .status(404)
        .json({ message: "failed to insert data", Data: req.body });
    }
  } catch (error) {
    db.rollback();
    console.log("error:-", error);
    res.status(500).json({ message: "operation failed" });
  }
};

exports.getAllBrandData = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM tg_product_brand ORDER BY id asc",
      function (err, data) {
        if (err) {
          res.status(500).send({ error: "Data not Found" });
        } else {
          res.status(200).send({ message: "All Brands Data", data });
        }
      }
    );
  } catch (error) {
    db.rollback();
    res.status(401).json({ error: "Data Error" });
  }
};

exports.deleteBrandData = async (req, res) => {
  try {
    db.beginTransaction();
    var deletedData = await productsModel.deletedBrands(req.body);
    if (deletedData.affectedRows) {
      db.commit();
      res.json({ message: "Brands Deleted Successfull" });
    } else {
      db.rollback();
      res.status(401).json({ error: "Datas Errorsssss" });
    }
  } catch (error) {
    if (error === "Data was not found") {
      db.rollback();
      res.status(404).json({ message: "Data was not found" });
    }
    db.rollback();
    res.status(401).json({ error: "Data Error" });
  }
};



exports.addProduct = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const x = matchedData(req);
    return res.send({
      message: "Invalid Values",
      status: "invalid",
      err: errors.mapped(),
    });
  }
  try {
    const {
      cat_id,
      brand_id,
      title,
      model,
      price,
      salePrice,
      productImg,
      imageData,
    } = req.body;
    var base64ToImage = await base64ToSingleFilePath.base64ToImage(productImg);

    const allData = { cat_id, brand_id, title, model, price, salePrice };
    db.beginTransaction();
    var data = await productsModel.addProduct(allData, base64ToImage.fileName);

    if (data.insertId) {
      var prdctId = data.insertId;

      if (imageData.length > 0) {
        try {
          var i = imageData.length - 1;
          const responseData = [];
          imageData.forEach(async (element) => {
            // element.base64 = element.base64;
            var base64ToFile = await base64ToFilePath.base64ToImage(element);
            console.log("base64ToFile", base64ToFile);

            responseData.push(base64ToFile);
            console.log("responseData:- ", responseData);

            if (i == 0) {
              await productsModel.addProductGallery(prdctId, responseData);
            }
            i--;
          });

          db.commit();
          res.status(200).json({ message: "Product Add Successfully" });
        } catch (imageError) {
          db.rollback();
          console.error("Image insertion error:", imageError);
          res
            .status(500)
            .json({ message: "Failed to insert product gallery images" });
        }
      } else {
        db.commit();
        res.status(200).json({ message: "Product Add Successfully" });
      }
    } else if ("Product already exists") {
      db.rollback();
      res.status(404).json({ message: "Product name already exists" });
    } else {
      db.rollback();
      res
        .status(404)
        .json({ message: "failed to insert data", Data: req.body });
    }
  } catch (error) {
    db.rollback();
    console.log("error:-", error, "ers");
    res.status(500).json({ message: "operation failed" });
  }
};

exports.getAllProductData = async (req, res) => {
  try {
    db.query(
      `SELECT
      p.cat_id,
      p.brand_id,
      p.title,
      p.model,
      FORMAT(p.price, 2) AS price,
      FORMAT(p.salePrice, 2) AS salePrice,
      p.id AS product_id,
      GROUP_CONCAT(g.gallery_id) AS gallery_ids,
      GROUP_CONCAT(g.image_path) AS gallery_images
  FROM
      tg_products AS p
  INNER JOIN
      (
          SELECT
              product_id,
              id AS gallery_id,
              image_path
          FROM
              tg_product_gallery
      ) AS g ON p.id = g.product_id
  GROUP BY
      p.cat_id,
      p.brand_id,
      p.title,
      p.model,
      p.price,
      p.salePrice,
      p.id;
  `,
      function (err, data) {
        if (err) {
          console.error(err); // Log the error for debugging
          return res.status(500).json({ error: "Internal Server Error" });
        }
        const updatedData = [...data];

        updatedData.forEach((row, index) => {
          updatedData[index].gallery_images = updatedData[index].gallery_images.split(",");
            updatedData[index].gallery_ids =  updatedData[index].gallery_ids.split(",");

            updatedData[index].gallery_ids.forEach((item,i)=>{
              updatedData[index].gallery_images[i] = {
                id: item,
                path: updatedData[index].gallery_images[i]
              }
            })
            delete updatedData[index].gallery_ids;
        });

        return res
          .status(200)
          .json({ message: "All Product Data", products: updatedData });
      }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    db.query(
      `SELECT
    p.cat_id,
    p.brand_id,
    p.title,
    p.model,
    FORMAT(p.price, 2) AS price,
    FORMAT(p.salePrice, 2) AS salePrice,
    p.id AS product_id,
    GROUP_CONCAT(g.gallery_id) AS gallery_ids,
    GROUP_CONCAT(g.image_path) AS gallery_images
  FROM
    tg_products AS p
  INNER JOIN
    (    SELECT
              product_id,
              id AS gallery_id,
              image_path
          FROM
              tg_product_gallery
      ) AS g ON p.id = g.product_id
  WHERE
    p.id = ?
  GROUP BY
    p.cat_id,
    p.brand_id,
    p.title,
    p.model,
    p.price,
    p.salePrice,
    p.id;`,
      [productId],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (data.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
      
        const updatedData = [...data];

        updatedData.forEach((row, index) => {
          updatedData[index].gallery_images = updatedData[index].gallery_images.split(",");
            updatedData[index].gallery_ids =  updatedData[index].gallery_ids.split(",");

            updatedData[index].gallery_ids.forEach((item,i)=>{
              updatedData[index].gallery_images[i] = {
                id: item,
                path: updatedData[index].gallery_images[i]
              }
            })
            delete updatedData[index].gallery_ids;
        });

        return res
          .status(200)
          .json({ message: "All Product Data", products: updatedData });
      }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteProductData = async (req, res) => {
    try {
      db.beginTransaction();
      var deletedGalleryImg = await productsModel.deleteProductGallery(req.params);
        if (deletedGalleryImg.affectedRows) {
            var deletedData = await productsModel.deleteProduct(req.params);
                if(deletedData.affectedRows){
                    db.commit();
                    res.json({ message: "Product Data is Deleted Successfull" });
                }
        } else {
            db.rollback();
            res.status(401).json({ error: "Datas Errorsssss" });
      }
    } catch (error) {
      if (error === "Data was not found") {
        db.rollback();
        res.status(404).json({ message: "Data was not found" });
      }
      db.rollback();
      res.status(401).json({ error: "Data Error" });
    }
};

exports.updatedProductData = async function(req, res)  {
  const {id, cat_id, brand_id, title, model, price, salePrice, mainImg, imageData, remove_gallery} = req.body;
  try {
    var base64ToImage = await base64ToSingleFilePath.base64ToImage(mainImg);
    const allData = {id, cat_id, brand_id, title, model, price, salePrice}

      db.beginTransaction()
      var productData = await productsModel.changeProductData(allData, base64ToImage.fileName)
      console.log(productData, "productData")
      if(productData.affectedRows){

        if (imageData.length > 0) {
          try {
            var i = imageData.length - 1;
            const responseData = [];
            imageData.forEach(async (element) => {
              var base64ToFile = await base64ToFilePath.base64ToImage(element);
              console.log("base64ToFile", base64ToFile);
  
              responseData.push(base64ToFile);
              console.log("responseData:- ", responseData);
  
              if (i == 0) {
                await productsModel.addProductGallery(allData.id, responseData);
              }
              i--;
            });
  
            if (remove_gallery.length > 0) {
              await productsModel.removeGalleryImages(remove_gallery);
           }

            db.commit();
            res.status(200).json({ message: "Product Gallery is Updated Successfully" });
  
          } catch (imageError) {
            db.rollback();
            console.error("Image insertion error:", imageError);
            res.status(500).json({ message: "Failed to insert product gallery images" });
          }
        } else {
          db.commit();
          res.status(200).json({message: "Product data has been changed successfull", data: req.body });
        }


      }else{
          db.rollback();
          res.status(401).json({message: "Product Data is not updated"})
      }
  } catch (error) {
      db.rollback();
      res.status(401).json({ error: "Data Error" });
  }
}






exports.base64ToSingleFile = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const x = matchedData(req);
    return res.send({
      message: "Invalid Values",
      status: "invalid",
      err: errors.mapped(),
    });
  }

  // console.log('herererer');
  // var base64ToFile = await Master.base64ToFile(req.body);
  // console.log('base64ToFile', base64ToFile);
  var base64ToImage = await base64ToSingleFilePath.base64ToImage(req.body);
  console.log("base64ToImage", base64ToImage);

  res.status(200).json({
    message: "Uploaded",
    status: "success",
    response: base64ToImage,
  });
};

exports.base64ToFile = async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const x = matchedData(req);
    return res.send({
      message: "Invalid Values",
      status: "invalid",
      err: errors.mapped(),
    });
  }

  console.log("herererer");
  console.log("req.body", req.body.imageData.length);

  if (req.body.imageData.length > 0) {
    var i = req.body.imageData.length - 1;
    var responseData = [];
    req.body.imageData.forEach(async (element) => {
      element.base64 = element.base64;

      // var base64ToFile = await Master.base64ToFile(element);
      // console.log('base64ToFile', base64ToFile);

      var base64ToFile = await base64ToFilePath.base64ToImage(element);
      console.log("base64ToFile", base64ToFile);

      responseData.push(base64ToFile);
      if (i == 0) {
        res.status(200).json({
          message: "Uploaded",
          status: "success",
          response: responseData,
        });
      }
      i--;
    });
  } else {
    res.status(200).json({
      message: "Uploaded",
      status: "error",
    });
  }
};
