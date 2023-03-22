const ApiFeatures = require('../utils/APIFeatures');
const ProviderReview = require('../models/providerreview-m');
const catchAsync = require('../utils/catchAsync');

exports.getReviews = catchAsync(async (req, res, next) => {
    const feature = new ApiFeatures(
        ProviderReview.find().populate("reviewerId"),
            req.query
        )
            .filter()
            .sort()
            .paginate();
    reviews = await feature.query;

    res.status(200).json({
        status: 'success',
        data: reviews
    })
});

exports.createReview = catchAsync(async (req, res, next) => {
    let {
        providerId,
        review
    } = req.body;

    let reviewRes = await ProviderReview.create({
        providerId,
        reviewerId: req.query.id,
        review,
    });

    res.status(200).json({
        status: 'success',
        data: reviewRes
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    let reviewId = req.query.reviewId;
    let result = await ProviderReview.deleteOne({
        _id: reviewId
    })
    res.status(200).json({
        status: "success",
        data: result
    })
})