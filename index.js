const express = require("express");
const app = express();
const db = require("./db");
var csurf = require("csurf");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.setHeader("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.get("/favicon.ico", (req, res) => {
    res.send("");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});
app.get("/profiles", (req, res) => {
    res.render("profiles", {
        layout: "main"
    });
});

app.get("/thanks", (req, res) => {
    db.getSignature(req.session.signatureId).then(results => {
        res.render("thanks", {
            layout: "main",
            signature: results.rows[0].signature
        });
    });
});

app.get("/signers", (req, res) => {
    db.getSigners().then(results => {
        res.render("signers", {
            layout: "main",
            signers: results.rows
        });
    });
});

app.post("/petition", (req, res) => {
    console.log("POST /petition");
    db.addSign(req.session.userId, req.body.signature)
        .then(results => {
            req.session.signatureId = results.rows[0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.render("petition", {
                layout: "main",
                error: "An error occurred.Please try again",
                signature: req.body.signature
            });
            console.log("err in addSign: ", err);
        });
});
app.get("/", (req, res) => {
    res.redirect("/register");
});
app.post("/register", (req, res) => {
    hashPassword(req.body.password).then(hash => {
        db.addUser(req.body.firstname, req.body.lastname, req.body.email, hash)
            .then(() => {
                res.redirect("/login");
            })
            .catch(err => {
                res.render("register", {
                    layout: "main",
                    error: "An error occurred.Please try again",
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                });
                console.log("err in addUser: ", err);
            });
    });
});

app.post("/login", (req, res) => {
    db.getUser(req.body.email)
        .then(results => {
            if (results.rows.length == 1) {
                checkPassword(req.body.password, results.rows[0].password)
                    .then(() => {
                        req.session.firstname = results.rows[0].firstname;
                        req.session.lastname = results.rows[0].lastname;
                        req.session.email = results.rows[0].email;
                        req.session.userId = results.rows[0].id;
                        res.redirect("/profiles");
                    })
                    .catch(() => {
                        res.render("login", {
                            layout: "main",
                            error:
                                "Password or email is wrong. Please try again",
                            email: req.body.email
                        });
                    });
            } else {
                res.render("login", {
                    layout: "main",
                    error: "Password or email is wrong. Please try again",
                    email: req.body.email
                });
            }
        })
        .catch(err => {
            res.render("login", {
                layout: "main",
                error: "An error occurred.Please try again",
                email: req.body.email
            });
            console.log("err in User: ", err);
        });
});
app.post("/profiles", (req, res) => {
    if (!req.body.age && !req.body.city && !req.body.homepage) {
        return res.redirect("/petition");
    }
    if (
        !req.body.homepage.startsWith("http://") &&
        !req.body.homepage.startsWith("https://") &&
        !req.body.homepage.startsWith("//")
    ) {
        req.body.homepage = "http://" + req.body.homepage;
    }
    db.addUserProfile(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.userId
    )
        .then(() => {
            res.redirect("/petition");
        })
        .catch(err => {
            res.render("profiles", {
                layout: "main",
                error: "An error occurred.Please try again",
                age: req.body.age,
                city: req.body.city,
                url: req.body.homepage
            });
            console.log("err in addUserProfile: ", err);
        });
});
var bcrypt = require("bcryptjs");

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}
function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
}
//how do we query a database from an express server?

app.listen(8080, () => console.log("PETITION"));
