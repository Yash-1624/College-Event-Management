require("dotenv").config();

const bcrypt =
    require("bcryptjs");

const mongoose =
    require("mongoose");

const User =
    require("../models/User");

const seedAdmin =
    async () => {
        try {
            await mongoose.connect(
                process.env.MONGO_URI
            );

            const email =
                "admin@example.com";

            const password =
                "Admin@12345";

            const existing =
                await User.findOne({
                    email
                });

            if (existing) {
                console.log(
                    "Admin already exists."
                );

                process.exit(0);
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

            await User.create({
                fullName:
                    "System Administrator",

                email,

                mobileNumber:
                    "9999999999",

                collegeName:
                    "College Administration",

                yearSemester:
                    "Administrator",

                password:
                    hashedPassword,

                role:
                    "admin",

                isEmailVerified:
                    true
            });

            console.log(
                "Admin created successfully."
            );

            console.log(
                "Email:",
                email
            );

            console.log(
                "Password:",
                password
            );

            process.exit(0);

        } catch (error) {
            console.error(
                error
            );

            process.exit(1);
        }
    };

seedAdmin();