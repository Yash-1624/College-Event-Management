const router =
    require("express").Router();

const controller =
    require("../controllers/profileController");

const {
    protect
} =
    require("../middleware/authMiddleware");

router.get(
    "/",
    protect,
    controller.getProfile
);

router.put(
    "/",
    protect,
    controller.updateProfile
);

module.exports = router;