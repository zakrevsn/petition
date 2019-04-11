var spicedPg = require("spiced-pg");

var dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/tabasco-petition";
var db = spicedPg(dbUrl);

exports.addSign = function addSign(userId, signature) {
    let q = `INSERT INTO signature (user_id, signature) VALUES ($1, $2) RETURNING * `;
    let params = [userId, signature];
    return db.query(q, params);
};
exports.getSigners = function getSigners() {
    return db.query(
        `SELECT firstname, lastname, age, city, url
        FROM signature
        JOIN users ON signature.user_id = users.id
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id `
    );
};
exports.getSignature = function getSignature(id) {
    let q = `SELECT signature FROM signature WHERE user_id=$1`;
    let params = [id];
    return db.query(q, params);
};
exports.addUser = function addUser(firstname, lastname, email, password) {
    let q = `INSERT INTO users(firstname, lastname, email, password)
    VALUES ($1, $2, $3, $4) RETURNING * `;
    let params = [firstname, lastname, email, password];
    return db.query(q, params);
};
exports.getUser = function getUser(email) {
    let q = `SELECT * FROM users WHERE email=$1`;
    let params = [email];
    return db.query(q, params);
};
exports.addUserProfile = function addUserProfile(age, city, homepage, userId) {
    let q = `INSERT INTO user_profiles(age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT(user_id)
    DO UPDATE
    SET age = $1,
        city = $2,
        url = $3
    RETURNING * `;
    let params = [age, city, homepage, userId];
    return db.query(q, params);
};
exports.getUserProfile = function getUserProfile(userId) {
    let q = `SELECT * FROM users
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id
    WHERE users.id=$1`;
    let params = [userId];
    return db.query(q, params);
};
exports.getSignersCity = function getSignersCity(city) {
    let q = `SELECT firstname, lastname, age, city, url
        FROM signature
        JOIN users ON signature.user_id = users.id
        LEFT JOIN user_profiles ON user_profiles.user_id = users.id
        WHERE city=$1`;
    let params = [city];
    return db.query(q, params);
};
exports.editUserProfile = function editUserProfile(
    firstname,
    lastname,
    email,
    age,
    city,
    homepage,
    userId,
    hash
) {
    let qUsers = `
        UPDATE users
        SET firstname = $1,
            lastname = $2,
            email = $3,
            password = $4
        WHERE id = $5
        `;
    let qProfiles = `
    INSERT INTO user_profiles(age, city, url, user_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id)
    DO UPDATE
    SET age = $1,
        city = $2,
        url = $3`;

    let paramsUsers = [firstname, lastname, email, hash, userId];
    let paramsProfiles = [age, city, homepage, userId];

    return Promise.all([
        db.query(qUsers, paramsUsers),
        db.query(qProfiles, paramsProfiles)
    ]);
};
exports.deleteSignature = function deleteSignature(userId) {
    let q = `DELETE FROM signature
    WHERE user_id=$1`;
    let params = [userId];
    return db.query(q, params);
};
