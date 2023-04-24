const express = require('express');
const bus = require('../utils/busFile');
const multer = require('../utils/midMulter');
const authController = require('./../controllers/auth-c');
const authMW = require('./../controllers/auth-mw');
const itemController = require('./../controllers/item-c');

const router = express.Router();

router.get('/', itemController.getItems);
router.get('/search', itemController.searchItems);
router.post('/', authController.guard, authMW.restrictTo(['admin', 'provider']), authMW.limitPost, multer.single("image"), itemController.createItem);
router.patch('/', authController.guard, authMW.restrictTo(['admin', 'provider']), itemController.update);
router.delete('/', authController.guard, authMW.restrictTo(['admin', 'provider']), itemController.deleteItem);

module.exports = router;
