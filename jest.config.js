require('dotenv').config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [`${process.env.APP_RUN == 'dist' ? './dist' : './src'}/tests/setup.${process.env.APP_RUN == 'dist' ? 'js' : 'ts'}`],
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