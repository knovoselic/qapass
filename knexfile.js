require('dotenv').config()

module.exports = {
    client: 'mysql',
    connection: {
        host: process.env.DB_PORT || 3306,
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
}
