const hash = require("../../utils/hash");

describe('hash utility', () => {
    test('the encrypt method should be consistent', () => {
        const password = 'password!12';
        const hash1 = hash.encrypt(password);
        const hash2 = hash.encrypt(password);
        expect(hash1).toBe(hash2);
    });

    test('compare should return true for matching password with hash code', () => {
        const password = 'password!12';
        const hashed = hash.encrypt(password);
        expect(hash.compare(password, hashed)).toBe(true);
    })

    test('compare should return false for non-matching pair', () => {
        const password = 'password!12';
        const hashed = hash.encrypt('anotherPassword');
        expect(hash.compare(password, hashed)).toBe(false);
    })
})