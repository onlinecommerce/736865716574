const express = require('express');
const authController = require('./../controllers/auth-c');
const authMW = require('./../controllers/auth-mw');
const itemController = require('./../controllers/item-c');
const multer = require('./../utils/multer');
const parser = require('./../utils/parser');
// const rec = require('./../controllers/recommandation-c');

const router = express.Router();

router.get('/', itemController.getItems);
router.get('/search', itemController.searchItems);
// router.get('/predict', authController.guard, rec.recommand);
router.post('/', authController.guard, authMW.restrictTo(['admin', 'provider']), itemController.createItem);
router.patch('/', authController.guard, authMW.restrictTo(['admin', 'provider']), itemController.update);
router.patch('/approve', authController.guard, authMW.restrictTo(['admin']), itemController.approve);
router.delete('/delete-item', authController.guard, authMW.restrictTo(['admin', 'provider']), itemController.deleteItem);

module.exports = router;