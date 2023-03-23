const express = require("express");
const authController = require("../controllers/auth-c");
const cateController = require("../controllers/category-c");
const Category = require("../models/category-m");
const categories = require("../utils/categories").categories;
const authMW = require('./../controllers/auth-mw');

const router = express.Router();

async function inits() {
  let cates = await Category.find();
  if (!cates.length) {
    cates = await Category.insertMany(categories);
  }
}

// inits();

router
  .route("/")
  .get(cateController.getCategory)
  .post(authController.guard, authMW.restrictTo(['admin']), cateController.saveCategory)
  .patch(authController.guard, authMW.restrictTo(['admin']), cateController.editCategory)
  .delete(authController.guard, authMW.restrictTo(['admin']), cateController.delCategory);

module.exports = router;