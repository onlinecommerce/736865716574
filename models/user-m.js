const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter your username"],
    unique: [true, "Username already exists"],
    validate: {
      validator(val) {
        var val = val.split(" ").join("_")
        let letters = "abcdefghijklmnopqrstuvwxyz".split("");
        let numbers = "1234567890".split("");
        let username = val.toLowerCase().split("");

        username = username.map((i) => {
          if (
            letters.indexOf(i) !== -1 ||
            numbers.indexOf(i) !== -1 ||
            i === "_"
          ) {
            return true;
          } else {
            return false;
          }
        });

        return username.every((bool) => bool);
      },
      message: "Username must be alphanumeric... e.g: lionel_messi_12",
    },
  },
  fullName: {
    type: String,
    required: [true, "Please enter full name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter phone number"],
    validate: {
      validator(val) {
        let numbers = "+1234567890".split("");

        return val
          .split("")
          .map((i) => (numbers.indexOf(i) !== -1 ? true : false))
          .every((bool) => bool);
      },
      message: "Please enter a valid phone number",
    },
  },
  location: String,
  contacts: String,
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter a password confirmation"],
    validate: {
      validator(val) {
        return this.password === val;
      },
      message: "Passwords didn't match",
    },
  },
  rating: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['admin', 'provider', 'customer'],
    default: 'customer'
  },
  order: {
    type: Number,
    default: 0
  },
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.query.filtered = function (name) {
  if (name) return this.where({
    name: new RegExp(name, "i")
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;