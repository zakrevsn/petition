const express = require("express");
const app = express();
const db = require("./db");

var hb = require("express-handlebars");
app.engine("handlebars", hb());
app.set("view engine", "handlebars");
app.use(express.static("./public"));

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(require("cookie-parser")());

app.get("/favicon.ico", (req, res) => {
    res.send("");
});

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main"
    });
});

app.get("/thanks", (req, res) => {
    res.render("thanks", {
        layout: "main"
    });
});

app.get("/signers", (req, res) => {
    db.getSigners().then(results => {
        console.log(results);
        res.render("signers", {
            layout: "main",
            signers: results.rows
        });
    });
});

app.post("/petition", (req, res) => {
    console.log("POST /petition");
    db.addSign(req.body.firstname, req.body.lastname, req.body.signature)
        .then(() => {
            console.log("SUCCESS!!!!");
        })
        .catch(err => {
            console.log("err in addSign: ", err);
        });
    res.redirect("/thanks");
});
//how do we query a database from an express server?

app.listen(8080, () => console.log("PETITION"));
