const express = require("express");

const paymentController = require("../controllers/paymentController");
const paymentRouter = express.Router();

paymentRouter.post("/payment", paymentController.checkoutPayment);


module.exports = paymentRouter;