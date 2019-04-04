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

app.get("/thanks", (req, res) => {
    console.log("this is my user id", req.session);

    db.getSignature(req.session.id).then(results => {
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
    db.addSign(req.body.firstname, req.body.lastname, req.body.signature)
        .then(results => {
            console.log(results.rows[0]);
            req.session.firstname = results.rows[0].firstname;
            req.session.lastname = results.rows[0].lastname;
            // req.session.signature = results.rows[0].signature;
            req.session.id = results.rows[0].id;
            res.redirect("/thanks");
        })
        .catch(err => {
            res.render("petition", {
                layout: "main",
                error: "An error occurred.Please try again",
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                signature: req.body.signature
            });
            console.log("err in addSign: ", err);
        });
});
app.get("/", (req, res) => {
    res.redirect("/petition");
});
//how do we query a database from an express server?

app.listen(8080, () => console.log("PETITION"));
