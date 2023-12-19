const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
const db = require('mysql')
var conn = db.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('Database connnected successfully');
})

module.exports = conn;