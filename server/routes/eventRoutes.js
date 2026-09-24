const express = require("express");

const router = express.Router();


const {
    getEvents,
    getAdminEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus
} = require("../controllers/eventController");


const {
    protect
} = require("../middleware/authMiddleware");


const {
    adminOnly
} = require("../middleware/adminMiddleware");


// ========================================
// ADMIN - GET ALL EVENTS
// ========================================

router.get(
    "/admin/all",
    protect,
    adminOnly,
    getAdminEvents
);


// ========================================
// STUDENT - GET EVENTS
// ========================================

router.get(
    "/",
    protect,
    getEvents
);


// ========================================
// GET SINGLE EVENT
// ========================================

router.get(
    "/:id",
    protect,
    getEventById
);


// ========================================
// ADMIN - CREATE EVENT
// ========================================

router.post(
    "/",
    protect,
    adminOnly,
    createEvent
);


// ========================================
// ADMIN - UPDATE EVENT
// ========================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateEvent
);


// ========================================
// ADMIN - DELETE EVENT
// ========================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteEvent
);


// ========================================
// ADMIN - UPDATE STATUS
// ========================================

router.patch(
    "/:id/status",
    protect,
    adminOnly,
    updateEventStatus
);


module.exports = router;