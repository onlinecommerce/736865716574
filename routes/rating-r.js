const express = require('express');
const authController = require('./../controllers/auth-c');
const authMW = require('./../controllers/auth-mw');
const ratingController = require('./../controllers/rating-c');

const router = express.Router();

router.get('/', authController.guard, ratingController.getRating);
router.post('/', authController.guard, ratingController.createRating);

module.exports = router;