const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const paymentController = require("../controller/paymentController");
const User = require("../models/userModel");

router.get(
  "/get-payment-details-by-user-id",
  authMiddleware,
  async (req, res) => {
    try {
      const appointments = await Appointment.find({ userId: req.body.userId });
      res.status(200).send({
        message: "Payment Details fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error,
      });
    }
  }
);



module.exports = router;

router.post("/create-order", paymentController.orderCreate);
router.post("/card-details", paymentController.cardDetail);

module.exports = router;
