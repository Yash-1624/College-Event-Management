const Event = require("../models/Event");
const Category = require("../models/Category");

// ========================================
// GET EVENTS FOR STUDENTS
// ========================================

exports.getEvents = async (req, res, next) => {
    try {

        const events = await Event.find({
            status: {
                $in: [
                    "Published",
                    "Registration Open"
                ]
            }
        }).sort({
            date: 1
        });

        res.json({
            success: true,
            events
        });

    } catch (error) {
        next(error);
    }
};


// ========================================
// GET SINGLE EVENT
// ========================================

exports.getEventById = async (
    req,
    res,
    next
) => {

    try {

        const event =
            await Event.findById(
                req.params.id
            );

        if (!event) {

            return res.status(404).json({
                success: false,
                message: "Event not found."
            });

        }

        res.json({
            success: true,
            event
        });

    } catch (error) {
        next(error);
    }

};


// ========================================
// GET ALL EVENTS FOR ADMIN
// ========================================

exports.getAdminEvents = async (
    req,
    res,
    next
) => {

    try {

        const events =
            await Event.find({})
                .sort({
                    createdAt: -1
                });

        res.json({
            success: true,
            events
        });

    } catch (error) {
        next(error);
    }

};


// ========================================
// CREATE EVENT
// ========================================

exports.createEvent = async (
    req,
    res,
    next
) => {

    try {

        console.log(
            "CREATE EVENT REQUEST:"
        );

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );


        /*
         * Accept both possible naming styles.
         *
         * New form:
         * eventName
         * eventDescription
         * eventCategory
         * eventDate
         * eventLocation
         *
         * Old/backend form:
         * name
         * description
         * category
         * date
         * location
         */

        const name =
            req.body.name ||
            req.body.eventName;

        const description =
            req.body.description ||
            req.body.eventDescription;

        const category =
            req.body.category ||
            req.body.eventCategory;

        const date =
            req.body.date ||
            req.body.eventDate;

        const location =
            req.body.location ||
            req.body.eventLocation;

        const registrationStartDate =
            req.body.registrationStartDate ||
            req.body.registrationStart;

        const registrationEndDate =
            req.body.registrationEndDate ||
            req.body.registrationEnd;

        const participationType =
            req.body.participationType;

        const teamSettings =
            req.body.teamSettings;

        const status =
            req.body.status ||
            "Draft";

        const fee =
            req.body.fee;


        // ========================================
        // REQUIRED FIELD VALIDATION
        // ========================================

        if (
            !name ||
            !description ||
            !category ||
            !date ||
            !location ||
            !registrationStartDate ||
            !registrationEndDate
        ) {

            console.log(
                "Missing required fields:"
            );

            console.log({
                name,
                description,
                category,
                date,
                location,
                registrationStartDate,
                registrationEndDate
            });


            return res.status(400).json({

                success: false,

                message:
                    "Name, category, date and venue are required.",

                missingFields: {

                    name: !name,

                    description:
                        !description,

                    category:
                        !category,

                    date:
                        !date,

                    location:
                        !location,

                    registrationStartDate:
                        !registrationStartDate,

                    registrationEndDate:
                        !registrationEndDate
                }

            });

        }


        // ========================================
        // CLEAN CATEGORY NAME
        // ========================================

        const categoryName =
            String(category).trim();

        if (!categoryName) {

            return res.status(400).json({
                success: false,
                message: "Category is required."
            });

        }


        // ========================================
        // ADD CATEGORY TO CATEGORIES COLLECTION
        // ========================================

        /*
         * When admin creates an event with a new
         * category, automatically create that
         * category in the categories collection.
         *
         * If the category already exists, activate it.
         */

        let categoryRecord =
            await Category.findOne({
                name: categoryName
            });

        if (!categoryRecord) {

            categoryRecord =
                await Category.create({
                    name: categoryName,
                    isActive: true
                });

        } else {

            categoryRecord.isActive = true;

            await categoryRecord.save();

        }


        // ========================================
        // VALIDATE DATES
        // ========================================

        const startDate =
            new Date(
                registrationStartDate
            );

        const endDate =
            new Date(
                registrationEndDate
            );

        const eventDate =
            new Date(date);


        if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime()) ||
            isNaN(eventDate.getTime())
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please provide valid event and registration dates."
            });

        }


        if (
            startDate >= endDate
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Registration start date must be before registration end date."
            });

        }


        // ========================================
        // PARTICIPATION TYPE
        // ========================================

        const individual =
            Boolean(
                participationType?.individual
            );

        const team =
            Boolean(
                participationType?.team
            );


        if (
            !individual &&
            !team
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please select Individual, Team, or both."
            });

        }


        // ========================================
        // TEAM SETTINGS
        // ========================================

        let minMembers = 2;

        let maxMembers = 5;


        if (teamSettings) {

            minMembers =
                Number(
                    teamSettings.minMembers
                ) || 2;

            maxMembers =
                Number(
                    teamSettings.maxMembers
                ) || 5;

        }


        if (
            team &&
            (
                minMembers < 2 ||
                maxMembers < minMembers
            )
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid team member limits."
            });

        }


        // ========================================
        // CREATE EVENT
        // ========================================

        const event =
            await Event.create({

                name:
                    String(name).trim(),

                description:
                    String(description).trim(),

                category:
                    categoryRecord.name,

                date:
                    eventDate,

                location:
                    String(location).trim(),

                registrationStartDate:
                    startDate,

                registrationEndDate:
                    endDate,

                participationType: {

                    individual,

                    team

                },

                teamSettings: {

                    enabled:
                        team,

                    minMembers,

                    maxMembers

                },

                status,

                fee:
                    Number(fee) || 0,

                createdBy:
                    req.user._id

            });


        console.log(
            "EVENT CREATED:",
            event._id
        );


        res.status(201).json({

            success: true,

            message:
                "Event created successfully.",

            event

        });


    } catch (error) {

        console.error(
            "CREATE EVENT ERROR:"
        );

        console.error(
            error
        );


        if (
            error.name ===
            "ValidationError"
        ) {

            const errors = {};

            Object.keys(
                error.errors
            ).forEach(
                (field) => {

                    errors[field] =
                        error.errors[
                            field
                        ].message;

                }
            );


            return res.status(400).json({

                success: false,

                message:
                    "Event validation failed.",

                errors

            });

        }


        next(error);

    }

};


// ========================================
// UPDATE EVENT
// ========================================

exports.updateEvent = async (
    req,
    res,
    next
) => {

    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {

            return res.status(404).json({
                success: false,
                message:
                    "Event not found."
            });

        }


        const body = {
            ...req.body
        };


        // ========================================
        // SUPPORT NEW FRONTEND FIELD NAMES
        // ========================================

        if (
            body.eventName !== undefined
        ) {

            body.name =
                body.eventName;

            delete body.eventName;

        }


        if (
            body.eventDescription !== undefined
        ) {

            body.description =
                body.eventDescription;

            delete body.eventDescription;

        }


        if (
            body.eventCategory !== undefined
        ) {

            body.category =
                body.eventCategory;

            delete body.eventCategory;

        }


        if (
            body.eventDate !== undefined
        ) {

            body.date =
                body.eventDate;

            delete body.eventDate;

        }


        if (
            body.eventLocation !== undefined
        ) {

            body.location =
                body.eventLocation;

            delete body.eventLocation;

        }


        // ========================================
        // CATEGORY UPDATE
        // ========================================

        /*
         * If admin changes the category while
         * editing the event:
         *
         * Example:
         *
         * Old:
         * Technical
         *
         * New:
         * AI & Machine Learning
         *
         * The new category is automatically added
         * to the categories collection.
         */

        if (
            body.category !== undefined
        ) {

            const newCategoryName =
                String(body.category).trim();


            if (!newCategoryName) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Category is required."
                });

            }


            const oldCategoryName =
                event.category;


            // Find the new category
            let categoryRecord =
                await Category.findOne({
                    name: newCategoryName
                });


            // Create category if it does not exist
            if (!categoryRecord) {

                categoryRecord =
                    await Category.create({
                        name: newCategoryName,
                        isActive: true
                    });

            } else {

                // Reactivate category if it was inactive
                categoryRecord.isActive = true;

                await categoryRecord.save();

            }


            // Save the new category name in event
            body.category =
                categoryRecord.name;


            /*
             * If category was changed, check whether
             * the old category is still used by any
             * other event.
             *
             * If no other event uses it, deactivate
             * the old category.
             *
             * We do NOT delete it because old records
             * should remain safe.
             */

            if (
                oldCategoryName &&
                oldCategoryName !==
                newCategoryName
            ) {

                const otherEventUsingOldCategory =
                    await Event.findOne({
                        _id: {
                            $ne:
                                event._id
                        },
                        category:
                            oldCategoryName
                    });


                if (
                    !otherEventUsingOldCategory
                ) {

                    await Category.findOneAndUpdate(
                        {
                            name:
                                oldCategoryName
                        },
                        {
                            $set: {
                                isActive: false
                            }
                        }
                    );

                }

            }

        }


        // ========================================
        // PARTICIPATION
        // ========================================

        if (
            body.participationType
        ) {

            body.participationType = {

                individual:
                    Boolean(
                        body.participationType.individual
                    ),

                team:
                    Boolean(
                        body.participationType.team
                    )

            };


            if (
                !body.participationType.individual &&
                !body.participationType.team
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "At least one participation type is required."
                });

            }

        }


        // ========================================
        // TEAM SETTINGS
        // ========================================

        if (
            body.teamSettings
        ) {

            const min =
                Number(
                    body.teamSettings.minMembers
                ) || 2;

            const max =
                Number(
                    body.teamSettings.maxMembers
                ) || 5;


            if (
                min < 2 ||
                max < min
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid team limits."
                });

            }


            body.teamSettings = {

                enabled:
                    Boolean(
                        body.participationType?.team ??
                        event.participationType.team
                    ),

                minMembers:
                    min,

                maxMembers:
                    max

            };

        }


        // ========================================
        // UPDATE EVENT
        // ========================================

        Object.assign(
            event,
            body
        );


        await event.save();


        res.json({

            success: true,

            message:
                "Event updated successfully.",

            event

        });


    } catch (error) {

        console.error(
            "UPDATE EVENT ERROR:",
            error
        );

        next(error);

    }

};


// ========================================
// DELETE EVENT
// ========================================

exports.deleteEvent = async (
    req,
    res,
    next
) => {

    try {

        const event =
            await Event.findById(
                req.params.id
            );


        if (!event) {

            return res.status(404).json({
                success: false,
                message:
                    "Event not found."
            });

        }


        await event.deleteOne();


        res.json({

            success: true,

            message:
                "Event deleted successfully."

        });


    } catch (error) {

        next(error);

    }

};


// ========================================
// UPDATE EVENT STATUS
// ========================================

exports.updateEventStatus = async (
    req,
    res,
    next
) => {

    try {

        const allowedStatuses = [

            "Draft",

            "Published",

            "Registration Open",

            "Registration Closed",

            "Completed",

            "Cancelled"

        ];


        const {
            status
        } = req.body;


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid event status."

            });

        }


        const event =
            await Event.findByIdAndUpdate(

                req.params.id,

                {
                    status
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!event) {

            return res.status(404).json({

                success: false,

                message:
                    "Event not found."

            });

        }


        res.json({

            success: true,

            message:
                "Event status updated successfully.",

            event

        });


    } catch (error) {

        next(error);

    }

};