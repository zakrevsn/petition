function requireLoggedInUser(req, res, next) {
    if (!req.session.userId && req.url != "/register" && req.url != "/login") {
        return res.redirect("/register");
    }
    next();
}

function requireNoSignature(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/register");
    }

    if (req.session.signatureId) {
        return res.redirect("/thanks");
    }
    next();
}

function requireSignature(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/register");
    }
    if (!req.session.signatureId) {
        return res.redirect("/petition");
    }
    next();
}

function requireLoggedOutUser(req, res, next) {
    if (req.session.userId) {
        return res.redirect("/petition");
    }
    next();
}

module.exports = {
    requireSignature,
    requireNoSignature,
    requireLoggedInUser,
    requireLoggedOutUser
};
