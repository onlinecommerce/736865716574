let mongoose = require('mongoose');

let reviewSchema = mongoose.Schema({
    providerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    reviewerId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    review: {
        type: String,
        required: [true, "Review required"],
    }
},{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    id: true
});

const review = mongoose.model("ProviderReview", reviewSchema);

module.exports = review;