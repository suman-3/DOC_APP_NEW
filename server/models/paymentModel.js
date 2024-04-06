const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    doctorEmail: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentId:{
        type: String,
        required: false,
    },
    orderId:{
        type: String,
        required: false,
    }
  },
);

const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = paymentModel;
