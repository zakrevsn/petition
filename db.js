var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postgres@localhost:5432/tabasco-petition");

exports.addSign = function addSign(firstname, lastname, signature) {
    let q = `INSERT INTO signature (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING * `;
    let params = [firstname, lastname, signature];
    return db.query(q, params);
};
exports.getSigners = function getSigners() {
    return db.query("SELECT firstname, lastname  FROM signature");
};
exports.getSignature = function getSignature(id) {
    let q = `SELECT signature FROM signature WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
exports.addUser = function addUser(firstname, lastname, email, password) {
    let q = `INSERT INTO users(firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING * `;
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};
exports.getUser = function getUser(email) {
    let q = `SELECT * FROM users WHERE email=$1`;
    let params = [email];
    return db.query(q, params);
};
