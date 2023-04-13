let mongoose = require('mongoose');

let itemSchema = mongoose.Schema({
    category: {
        type: String,
        required: [true, "Item must have a category"]
    },
    subCategory: {
        type: String,
        required: [true, "Item must have a subcategory"]
    },
    name: String,
    description: {
        type: String,
    },
    measurment: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 1
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Providers Id is required ']
    },
    available: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["New", "Slightly-used", "Used"],
        default: 'New'
    },
    type: {
        type: String,
        enum: ["Item", "Job", "CV"],
        default: "Item"
    }
    // image: {
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     }
    // }
}, {
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

const item = mongoose.model("Item", itemSchema);

module.exports = item;