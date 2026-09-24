module.exports =
    function generateTicketId() {

        const random =
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase();

        return `TKT-${Date.now()}-${random}`;
    };