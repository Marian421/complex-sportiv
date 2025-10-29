const crypto = require("crypto");

// makes a code to send to the user for reseting the password

function generateResetCode() {
  const code = crypto.randomBytes(32).toString("hex");
  return code;
}

module.exports = generateResetCode;
