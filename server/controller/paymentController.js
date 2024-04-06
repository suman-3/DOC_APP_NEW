const Razorpay = require("razorpay");

const paymentController = {
  async orderCreate(req, res, next) {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY,
      });

      const { order_id, amount, payment_capture, currency, name} = req.body;

      const options = {
        amount: amount * 100,
        currency: currency,
        receipt: order_id,
        payment_capture: payment_capture,
        name:name,

      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Something went wrong");

      res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },

  async cardDetail(req, res, next) {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_ID_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY,
      });
      const { razor_payment_id } = req.body;
      const order = await instance.payments.fetch(razor_payment_id);
      if (!order) return res.status(500).send("Something went wrong");

      res.status(200).json({ success: true, data: order });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },
};

module.exports = paymentController;
