const express = require("express");

const router = express.Router();

const {
    createPayment,
    verifyPayment
} =
    require("../controllers/paymentController");

const {
    protect
} =
    require("../middleware/authMiddleware");

const {
    adminOnly
} =
    require("../middleware/adminMiddleware");


// Create Razorpay order
router.post(
    "/create",
    protect,
    createPayment
);


// Verify Razorpay payment
router.post(
    "/verify",
    protect,
    verifyPayment
);


module.exports = router;