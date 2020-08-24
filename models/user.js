const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 50,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    created: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
    photo: {
      data: Buffer,
      contentType: String,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    following: [{ type: ObjectId, ref: "User" }],
    followers: [{ type: ObjectId, ref: "User" }],
    resetPasswordLink: {
      data: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

// virtual
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = bcrypt.genSaltSync(8);
    this.hashed_password = bcrypt.hashSync(password, this.salt);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return bcrypt.compareSync(plainText, this.hashed_password);
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return bcrypt.compareSync(password, this.hashed_password);
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
