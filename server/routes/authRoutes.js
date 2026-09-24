const router =
    require("express").Router();

const controller =
    require("../controllers/authController");

const {
    protect
} =
    require("../middleware/authMiddleware");

router.post(
    "/signup",
    controller.signup
);

router.post(
    "/verify-email",
    controller.verifyEmail
);

router.post(
    "/resend-otp",
    controller.resendOTP
);

router.post(
    "/login",
    controller.login
);

router.post(
    "/forgot-password",
    controller.forgotPassword
);

router.post(
    "/reset-password",
    controller.resetPassword
);

router.get(
    "/me",
    protect,
    controller.me
);

module.exports = router;