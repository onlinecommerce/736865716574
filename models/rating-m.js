let mongoose = require('mongoose');

let ratingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    raterId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Minimum rating is 1"],
        max: [5, "Maximum rating is 5"]
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

const rating = mongoose.model("Rating", ratingSchema);

module.exports = rating;