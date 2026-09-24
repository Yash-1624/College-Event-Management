const express = require("express");

const router =
    express.Router();

const {
    getCategories,
    activateCategory,
    deactivateCategory
} =
    require("../controllers/categoryController");

const {
    protect
} =
    require("../middleware/authMiddleware");

const {
    adminOnly
} =
    require("../middleware/adminMiddleware");


router.get(
    "/",
    protect,
    adminOnly,
    getCategories
);


router.patch(
    "/:id/activate",
    protect,
    adminOnly,
    activateCategory
);


router.patch(
    "/:id/deactivate",
    protect,
    adminOnly,
    deactivateCategory
);


module.exports = router;