require('dotenv').config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    testPathIgnorePatterns: [
        "<rootDir>/migrations/",
        "<rootDir>/src/requests/",
        "<rootDir>/node_modules/",
        "<rootDir>/src/middlewares/config",
        "<rootDir>/src/middlewares/stack",
        "<rootDir>/src/middlewares/web",
        "<rootDir>/src/middlewares/api",
        "<rootDir>/src/controllers/BaseController",
        "<rootDir>/ormconfig.js",
    ],
    coveragePathIgnorePatterns: [
        "<rootDir>/migrations/",
        "<rootDir>/src/requests/",
        "<rootDir>/node_modules/",
        "<rootDir>/src/middlewares/config",
        "<rootDir>/src/middlewares/stack",
        "<rootDir>/src/middlewares/web",
        "<rootDir>/src/middlewares/api",
        "<rootDir>/src/controllers/BaseController",
        "<rootDir>/ormconfig.js",
    ],
};
