exports.staffOnly =
    (
        req,
        res,
        next
    ) => {

        if (
            !req.user
        ) {

            return res
                .status(401)
                .json({

                    message:
                        "Authentication required."

                });

        }


        /*
         * Admin and volunteers can scan.
         *
         * If your User model uses another
         * volunteer role name, include it here.
         */
        if (
            req.user.role !==
            "admin" &&
            req.user.role !==
            "volunteer"
        ) {

            return res
                .status(403)
                .json({

                    message:
                        "Only admin or volunteer staff can scan tickets."

                });

        }


        next();

    };