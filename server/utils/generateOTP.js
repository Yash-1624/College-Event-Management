const crypto = require("crypto");

const generateOTP = () => {
    return String(crypto.randomInt(100000, 1000000));
};

module.exports = generateOTP;