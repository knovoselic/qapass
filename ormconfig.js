if (process.env.NODE_ENV === 'test') {
     process.env.DB_DATABASE = `${process.env.DB_DATABASE}_test`
}

let rootDir = './src';
let fileExtension = '.ts';
if (process.env.NODE_ENV == 'production') {
     rootDir = './dist';
     fileExtension = '.js';
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
         `${rootDir}/entity/**/*${fileExtension}`
    ],
    "migrations": [
         `${rootDir}/migration/**/*${fileExtension}`
    ],
    "subscribers": [
         `${rootDir}/subscriber/**/*${fileExtension}`
    ],
    "cli": {
       "entitiesDir": "./src/entity",
       "migrationsDir": "./src/migration",
       "subscribersDir": "./src/subscriber"
    }
 }
