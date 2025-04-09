
// simple algorithm for hashing the password in order to be secure for the database

const hash = (() => {
    const encrypt = (password) => {
        let hash = 5381; 
        for (let i = 0; i < password.length; i++) {
            hash = (hash * 33) ^ password.charCodeAt(i);
        }
        return hash >>> 0;
    }

    const compare = (password, hashedPassword) => {
        return encrypt(password) == hashedPassword;
    }

    return {encrypt, compare};
})();

module.exports = hash;