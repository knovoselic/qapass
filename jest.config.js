require('dotenv').config();

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [`${process.env.APP_RUN == 'dist' ? './dist' : './src'}/tests/setup.${process.env.APP_RUN == 'dist' ? 'js' : 'ts'}`]
};