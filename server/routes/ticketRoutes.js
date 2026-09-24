const router = require("express").Router();

const {
    protect
} = require("../middleware/authMiddleware");

const {
    adminOnly
} = require("../middleware/adminMiddleware");

const {
    getMyTicket,
    getTicketById,
    scanTicket,
    resetTicketEntry
} = require("../controllers/ticketController");


// =====================================================
// SPECIFIC ROUTES FIRST
// =====================================================

router.get(
    "/registration/:registrationId",
    protect,
    getMyTicket
);

router.post(
    "/scan",
    protect,
    adminOnly,
    scanTicket
);

router.patch(
    "/:ticketId/reset",
    protect,
    adminOnly,
    resetTicketEntry
);


// =====================================================
// DYNAMIC ROUTE LAST
// =====================================================

router.get(
    "/:ticketId",
    protect,
    getTicketById
);


module.exports = router;