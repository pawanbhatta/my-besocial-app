const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      email: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    profileImageId: {
      type: String,
      default: "",
    },
    coverImageId: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 500,
      default: "",
    },
    city: {
      type: String,
      max: 50,
      min: 3,
    },
    from: {
      type: String,
      max: 50,
      min: 3,
    },
    relationship: {
      type: String,
      // enum: [1, 2, 3],
      default: "Single",
    },
    gender: {
      type: String,
      // enum: [1, 2, 3],
      default: "Male",
    },
    interests: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
