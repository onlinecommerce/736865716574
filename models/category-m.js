const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    unique: [true, "Category must be unique"]
  },
  subcategory: [
    {
      type: String,
      required: [true, "Subcategory is required"],
    },
  ],
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

let Category = mongoose.model("Category", categorySchema);

module.exports = Category;
