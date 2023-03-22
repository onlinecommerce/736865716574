const express = require('express');
const authController = require('./../controllers/auth-c');
const authMW = require('./../controllers/auth-mw');
const providerreviewController = require('./../controllers/providerreview-c');

const router = express.Router();

router
    .get('/', providerreviewController.getReviews)
    .post('/', authController.guard, providerreviewController.createReview)
    .delete('/', authController.guard, authMW.restrictTo(['admin']), providerreviewController.deleteReview);


module.exports = router;