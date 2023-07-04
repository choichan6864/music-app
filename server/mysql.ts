const mysql = require("mysql2/promise");

export const pool = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWD,
    database:process.env.DB
}) 