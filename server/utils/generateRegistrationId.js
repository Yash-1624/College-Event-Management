const crypto = require("crypto");

const generateRegistrationId = () => {
    return `REG-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;
};

module.exports = generateRegistrationId;