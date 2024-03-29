const express = require("express");
const app = express();
const db = require("./db");
var csurf = require("csurf");
const cookieSession = require("cookie-session");
const {
    requireSignature,
    requireNoSignature,
    requireLoggedInUser,
    requireLoggedOutUser
} = require("./middleware");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

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
    res.locals.userId = req.session.userId;
    if (req.session.language == undefined) {
        req.session.language = "";
    }
    next();
});

app.get("/favicon.ico", (req, res) => {
    res.send("");
});

app.get("/lang/:language", (req, res) => {
    if (req.params.language == "en") {
        req.session.language = "";
    } else {
        req.session.language = req.params.language;
    }
    res.redirect(req.headers.referer || "/");
});

app.get("/petition", requireNoSignature, (req, res) => {
    res.render("petition" + req.session.language, {
        layout: "main" + req.session.language
    });
});

app.get("/login", requireLoggedOutUser, (req, res) => {
    res.render("login" + req.session.language, {
        layout: "main" + req.session.language
    });
});

app.get("/register", requireLoggedOutUser, (req, res) => {
    res.render("register" + req.session.language, {
        layout: "main" + req.session.language
    });
});
app.get("/profiles", requireLoggedInUser, (req, res) => {
    db.getUserProfile(req.session.userId).then(results => {
        res.render("profiles" + req.session.language, {
            layout: "main" + req.session.language,
            age: results.rows[0].age,
            city: results.rows[0].city,
            homepage: results.rows[0].url
        });
    });
});

app.get("/thanks", requireSignature, (req, res) => {
    db.getSignature(req.session.userId).then(results => {
        res.render("thanks" + req.session.language, {
            layout: "main" + req.session.language,
            signature: results.rows[0].signature
        });
    });
});

app.get("/signers", requireSignature, (req, res) => {
    db.getSigners().then(results => {
        res.render("signers" + req.session.language, {
            layout: "main" + req.session.language,
            signers: results.rows
        });
    });
});
app.get("/signers/:city", requireSignature, (req, res) => {
    db.getSignersCity(req.params.city).then(results => {
        console.log(results.rows);
        res.render("signers" + req.session.language, {
            layout: "main" + req.session.language,
            signers: results.rows,
            city: req.params.city
        });
    });
});
app.get("/update", requireLoggedInUser, (req, res) => {
    db.getUserProfile(req.session.userId).then(results => {
        res.render("update" + req.session.language, {
            layout: "main" + req.session.language,
            firstname: results.rows[0].firstname,
            lastname: results.rows[0].lastname,
            email: results.rows[0].email,
            age: results.rows[0].age,
            city: results.rows[0].city,
            homepage: results.rows[0].url
        });
    });
});
app.get("/", requireLoggedInUser, (req, res) => {
    res.redirect("/petition");
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});
app.get("/deletesign", requireSignature, (req, res) => {
    db.deleteSignature(req.session.userId).then(() => {
        req.session.signatureId = undefined;
        res.redirect("/petition");
    });
});

app.post("/petition", requireNoSignature, (req, res) => {
    console.log("POST /petition");
    db.addSign(req.session.userId, req.body.signature)
        .then(results => {
            req.session.signatureId = results.rows[0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.render("petition" + req.session.language, {
                layout: "main" + req.session.language,
                error: "An error occurred.Please try again",
                signature: req.body.signature
            });
            console.log("err in addSign: ", err);
        });
});

app.post("/register", requireLoggedOutUser, (req, res) => {
    hashPassword(req.body.password).then(hash => {
        db.addUser(req.body.firstname, req.body.lastname, req.body.email, hash)
            .then(() => {
                res.redirect("/login");
            })
            .catch(err => {
                res.render("register" + req.session.language, {
                    layout: "main" + req.session.language,
                    error: "An error occurred.Please try again",
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                });
                console.log("err in addUser: ", err);
            });
    });
});

app.post("/login", requireLoggedOutUser, (req, res) => {
    db.getUser(req.body.email)
        .then(results => {
            if (results.rows.length == 1) {
                checkPassword(req.body.password, results.rows[0].password)
                    .then(() => {
                        db.getSignature(results.rows[0].id).then(sigResult => {
                            console.log(sigResult);
                            req.session.firstname = results.rows[0].firstname;
                            req.session.lastname = results.rows[0].lastname;
                            req.session.email = results.rows[0].email;
                            req.session.userId = results.rows[0].id;
                            if (sigResult.rows.length > 0) {
                                console.log(
                                    results.rows[0].email,
                                    "got signature"
                                );
                                console.log(sigResult);
                                req.session.signatureId = sigResult.rows[0].id;
                            }
                            console.log("finishing login", req.session);
                            res.redirect("/profiles");
                        });
                    })
                    .catch(() => {
                        res.render("login" + req.session.language, {
                            layout: "main" + req.session.language,
                            error:
                                "Password or email is wrong. Please try again",
                            email: req.body.email
                        });
                    });
            } else {
                res.render("login" + req.session.language, {
                    layout: "main" + req.session.language,
                    error: "Password or email is wrong. Please try again",
                    email: req.body.email
                });
            }
        })
        .catch(err => {
            res.render("login" + req.session.language, {
                layout: "main" + req.session.language,
                error: "An error occurred.Please try again",
                email: req.body.email
            });
            console.log("err in User: ", err);
        });
});
app.post("/profiles", requireLoggedInUser, (req, res) => {
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
            res.render("profiles" + req.session.language, {
                layout: "main" + req.session.language,
                error: "An error occurred.Please try again",
                age: req.body.age,
                city: req.body.city,
                url: req.body.homepage
            });
            console.log("err in addUserProfile: ", err);
        });
});
app.post("/update", requireLoggedInUser, (req, res) => {
    hashPassword(req.body.password).then(hash => {
        db.getUserProfile(req.session.userId).then(results => {
            if (!req.body.password) {
                hash = results.rows[0].password;
            }
            db.editUserProfile(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                req.body.age,
                req.body.city,
                req.body.homepage,
                req.session.userId,
                hash
            )
                .then(() => {
                    res.redirect("/thanks");
                })
                .catch(err => {
                    res.redirect("/update");
                    console.log("err in addUserProfile", err);
                });
        });
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
module.exports = app;
if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("PETITION"));
}
