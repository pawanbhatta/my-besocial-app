const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    receivers: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
