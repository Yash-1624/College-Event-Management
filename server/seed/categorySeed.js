require("dotenv").config();

const connectDB = require("../config/db");
const Category = require("../models/Category");

const categories = [
    {
        name: "Technical",
        description: "Technical and technology-related events"
    },
    {
        name: "Cultural",
        description: "Cultural and performing arts events"
    },
    {
        name: "Sports",
        description: "Sports and physical activities"
    },
    {
        name: "Other",
        description: "Other college events"
    }
];

const seedCategories = async () => {
    try {
        await connectDB();

        for (const category of categories) {
            await Category.updateOne(
                { name: category.name },
                { $setOnInsert: category },
                { upsert: true }
            );
        }

        console.log("Default categories created successfully.");

        const allCategories = await Category.find().sort({ name: 1 });

        console.log("Categories:");
        allCategories.forEach((category) => {
            console.log("-", category.name);
        });

        process.exit(0);
    } catch (error) {
        console.error("Category seed failed:", error);
        process.exit(1);
    }
};

seedCategories();