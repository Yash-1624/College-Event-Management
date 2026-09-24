const Category = require("../models/Category");
const Event = require("../models/Event");


// ========================================
// GET ALL CATEGORIES
// ========================================

exports.getCategories = async (
    req,
    res,
    next
) => {
    try {

        /*
         * Find categories already stored
         * in the Categories collection.
         */
        let categories = await Category.find({})
            .sort({
                name: 1
            });


        /*
         * Also check existing events.
         *
         * This makes sure categories from
         * events created before the Category
         * collection existed are not lost.
         */
        const events = await Event.find(
            {},
            "category"
        );


        const eventCategories = [
            ...new Set(
                events
                    .map((event) =>
                        event.category?.trim()
                    )
                    .filter(Boolean)
            )
        ];


        /*
         * Automatically create missing
         * categories.
         */
        for (
            const categoryName
            of eventCategories
        ) {

            await Category.findOneAndUpdate(
                {
                    name: categoryName
                },
                {
                    $setOnInsert: {
                        name: categoryName,
                        isActive: true
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            );

        }


        /*
         * Fetch again after synchronization.
         */
        categories = await Category.find({})
            .sort({
                name: 1
            });


        return res.status(200).json({

            success: true,

            categories

        });


    } catch (error) {

        console.error(
            "Get categories error:",
            error
        );

        next(error);

    }
};


// ========================================
// CREATE CATEGORY
// ========================================

exports.createCategory = async (
    req,
    res,
    next
) => {

    try {

        const {
            name
        } = req.body;


        if (
            !name ||
            !name.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Category name is required."

            });

        }


        const categoryName =
            name.trim();


        /*
         * If category already exists,
         * reactivate it.
         */
        const existing =
            await Category.findOne({
                name: categoryName
            });


        if (existing) {

            existing.isActive = true;

            await existing.save();


            return res.status(200).json({

                success: true,

                message:
                    "Category already exists and has been activated.",

                category:
                    existing

            });

        }


        const category =
            await Category.create({

                name:
                    categoryName,

                isActive:
                    true

            });


        return res.status(201).json({

            success: true,

            message:
                "Category created successfully.",

            category

        });


    } catch (error) {

        console.error(
            "Create category error:",
            error
        );


        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "Category already exists."

            });

        }


        next(error);

    }
};


// ========================================
// DEACTIVATE CATEGORY
// ========================================

exports.deactivateCategory = async (
    req,
    res,
    next
) => {

    try {

        const category =
            await Category.findById(
                req.params.id
            );


        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found."

            });

        }


        category.isActive = false;

        await category.save();


        return res.status(200).json({

            success: true,

            message:
                "Category removed from the active category list.",

            category

        });


    } catch (error) {

        console.error(
            "Deactivate category error:",
            error
        );

        next(error);

    }
};


// ========================================
// ACTIVATE CATEGORY
// ========================================

exports.activateCategory = async (
    req,
    res,
    next
) => {

    try {

        const category =
            await Category.findById(
                req.params.id
            );


        if (!category) {

            return res.status(404).json({

                success: false,

                message:
                    "Category not found."

            });

        }


        category.isActive = true;

        await category.save();


        return res.status(200).json({

            success: true,

            message:
                "Category activated successfully.",

            category

        });


    } catch (error) {

        console.error(
            "Activate category error:",
            error
        );

        next(error);

    }
};