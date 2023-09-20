const express = require('express');
const adminController = require('../controller/adminController');
const productsController = require('../controller/productsController');
const offerController = require('../controller/offerController');
const authenticateToken = require('../middleware/auth');
const validateProduct = require('../validation/products');
var router = express.Router();
const { check, validationResult, matchedData, oneOf, body } = require('express-validator');


router.get('/',(req, res)=>{
    res.send("api vala route")
})


// Admin Api
router.post("/login",
oneOf([
  [
    check("email", "email is required")
      .isLength({ min: 10, max: 30 })
      .withMessage("email length must be in between 10-30 characters")
      .notEmpty()
      .withMessage("email is required"),
    check("password", "Password is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("Password length must be in between 5-20 characters")
      .notEmpty()
      .withMessage("Password is required"),
  ],
]), adminController.login)
router.post("/change-password",
oneOf([
  [
    check("email", "email is required")
    .isLength({ min: 10, max: 30 })
    .withMessage("email length must be in between 10-30 characters")
    .notEmpty()
    .withMessage("email is required"),
    check("password", "Password is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("Password length must be in between 5-20 characters")
      .notEmpty()
      .withMessage("Password is required"),
  ],
]), adminController.chnagePassword)
router.post("/log-out", authenticateToken, adminController.logOutAdmin)

// Categories Api
router.post("/add-category",
oneOf([
  [
      check("cat_name", "Name is required")
      .notEmpty()
      .withMessage("Name is required"),
  ],
]), authenticateToken, productsController.addCategory)
router.get("/view-all-category", productsController.getAllCatData)
router.post("/delete-category", authenticateToken, productsController.deleteCatData)

// Brands Api
router.post("/add-brand",
oneOf([
  [
      check("brand_name", "Name is required")
      .notEmpty()
      .withMessage("Name is required"),
  ],
]), authenticateToken, productsController.addBrand)
router.get("/view-all-brands", productsController.getAllBrandData)
router.post("/delete-brands", authenticateToken, productsController.deleteBrandData)

// Products Api
router.post("/add-product",
oneOf([
    [
      check("cat_id", "Category is required").notEmpty().withMessage("Category is required"),
      check("brand_id", "Brand is required").notEmpty().withMessage("Brand is required"),
      check("title", "Title is required").notEmpty().withMessage("Title is required"),
      check("model", "Model is required").notEmpty().withMessage("Model is required"),
      check("price", "Price is required").notEmpty().withMessage("Price is required"),
      check("salePrice", "Sale Price is required").notEmpty().withMessage("Sale Price is required"),
      check("productImg", "Main Images is required").notEmpty().withMessage("Main Images is required"),
    ],
]), authenticateToken, productsController.addProduct)
router.get("/view-all-product", productsController.getAllProductData)
router.get("/view-product/:id", productsController.getSingleProduct)
router.post("/delete-product/:id", productsController.deleteProductData)
router.post("/updated-product", validateProduct.updateProduct, productsController.updatedProductData)




router.post('/base64_to_file',
oneOf([
    [
        // check('base64', 'Base 64 is required').notEmpty(),
    ]
]), productsController.base64ToFile)

router.post('/base64_to_single_file',
oneOf([
    [
        // check('base64', 'Base 64 is required').notEmpty(),
    ]
]), productsController.base64ToSingleFile)




// Offers Api
router.post("/create-offers",
oneOf([
  [
    check("title", "Title is required")
    .notEmpty()
    .withMessage("Title is required")
  ],
]), authenticateToken, offerController.createOffers)
router.get("/view-all-offers", offerController.getAllOffers)
router.post("/delete-offers", authenticateToken, offerController.deletedOffers)
router.post("/update-offers-detailes", authenticateToken, offerController.updatedOffersData)


// router.get("/user-data", userController.getUserData)
// router.post("/delete", authenticateToken, userController.deleteUserdata)
// router.post("/generate-otp", userController.generateOTP)
// router.post("/verify-otp", userController.verifyOTP)
// router.post("/change-password", userController.chngePswd)

module.exports = router