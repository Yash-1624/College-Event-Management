const router =
    require("express").Router();

const controller =
    require("../controllers/adminController");

const {
    protect
} =
    require("../middleware/authMiddleware");

const {
    adminOnly
} =
    require("../middleware/adminMiddleware");


/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS
|--------------------------------------------------------------------------
|
| GET /api/admin/students
|
*/

router.get(
    "/students",
    protect,
    adminOnly,
    controller.getStudents
);


/*
|--------------------------------------------------------------------------
| GET STUDENT BY ID
|--------------------------------------------------------------------------
|
| GET /api/admin/students/:id
|
*/

router.get(
    "/students/:id",
    protect,
    adminOnly,
    controller.getStudentById
);


/*
|--------------------------------------------------------------------------
| GET ADMIN STATISTICS
|--------------------------------------------------------------------------
|
| GET /api/admin/stats
|
*/

router.get(
    "/stats",
    protect,
    adminOnly,
    controller.getStats
);


/*
|--------------------------------------------------------------------------
| GET ALL PAYMENTS
|--------------------------------------------------------------------------
|
| GET /api/admin/payments
|
| Used by the Admin Manage Payments page.
|
*/

router.get(
    "/payments",
    protect,
    adminOnly,
    controller.getPayments
);


module.exports =
    router;