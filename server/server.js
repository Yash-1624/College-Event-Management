const dotenv = require("dotenv");

// Load environment variables FIRST
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");


// ========================================
// DATABASE CONNECTION
// ========================================

connectDB();


// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        credentials: true
    })
);

// Parse JSON request body
app.use(express.json());


// ========================================
// ROUTES
// ========================================

// Authentication
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

// Student Profile
app.use(
    "/api/profile",
    require("./routes/profileRoutes")
);

// Events
app.use(
    "/api/events",
    require("./routes/eventRoutes")
);

// Event Categories
app.use(
    "/api/categories",
    require("./routes/categoryRoutes")
);

// Event Registrations
app.use(
    "/api/registrations",
    require("./routes/registrationRoutes")
);

// Payments / Razorpay
app.use(
    "/api/payments",
    require("./routes/paymentRoutes")
);

// Admin
app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

// Tickets / QR Scanner
app.use(
    "/api/tickets",
    require("./routes/ticketRoutes")
);


// ========================================
// API TEST ROUTE
// ========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "College Event Management API is running"
    });
});


// ========================================
// 404 ROUTE
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});


// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error(
        "Server Error:",
        err
    );

    res.status(
        err.status || 500
    ).json({

        success: false,

        message:
            err.message ||
            "Internal server error"
    });
});


// ========================================
// START SERVER
// ========================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            `Client URL: ${
                process.env.CLIENT_URL ||
                "http://localhost:5173"
            }`
        );

        console.log(
            `Razorpay Key ID loaded: ${
                process.env.RAZORPAY_KEY_ID
                    ? "YES"
                    : "NO"
            }`
        );

        console.log(
            `Razorpay Secret loaded: ${
                process.env.RAZORPAY_KEY_SECRET
                    ? "YES"
                    : "NO"
            }`
        );
    }
);