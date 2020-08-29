if (process.env.NODE_ENV === 'test') {
     process.env.DB_DATABASE = `${process.env.DB_DATABASE}_test`
}

module.exports = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 3306,
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "synchronize": false,
    "logging": false,
    "entities": [
         `${process.env.APP_RUN == 'dist' ? 'dist' : 'src'}/entity/**/*.${process.env.APP_RUN == 'dist' ? 'js' : 'ts'}`
    ],
    "migrations": [
         `${process.env.APP_RUN == 'dist' ? 'dist' : 'src'}/migration/**/*.${process.env.APP_RUN == 'dist' ? 'js' : 'ts'}`
    ],
    "subscribers": [
         `${process.env.APP_RUN == 'dist' ? 'dist' : 'src'}/subscriber/**/*.${process.env.APP_RUN == 'dist' ? 'js' : 'ts'}`
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
 }