const crypto = require('crypto');

function generateResetCode() {
    const code = crypto.randomBytes(32).toString('hex');
    return code;
}

module.exports = generateResetCode;