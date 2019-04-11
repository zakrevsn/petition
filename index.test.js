const supertest = require("supertest");
const app = require("./index.js");
const cookieSession = require("cookie-session");

test("GET /petition while not logged in redirect", () => {
    return supertest(app)
        .get("/petition")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/register");
        });
});
test("GET /register when logged in redirect to petition ", () => {
    cookieSession.mockSessionOnce({
        userId: 42
    });
    return supertest(app)
        .get("/register")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/petition");
        });
});
test("GET /login when logged in redirect to petition ", () => {
    cookieSession.mockSessionOnce({
        userId: 42
    });
    return supertest(app)
        .get("/login")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/petition");
        });
});
test("GET /petition when already signed redirects to thanks ", () => {
    cookieSession.mockSessionOnce({
        userId: 42,
        signatureId: 23
    });
    return supertest(app)
        .get("/petition")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/thanks");
        });
});
test("POST /petition when already signed redirects to thanks ", () => {
    cookieSession.mockSessionOnce({
        userId: 42,
        signatureId: 23
    });
    return supertest(app)
        .post("/petition")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/thanks");
        });
});
test("GET /thanks when has not signed redirects to petition ", () => {
    cookieSession.mockSessionOnce({
        userId: 42
    });
    return supertest(app)
        .get("/thanks")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/petition");
        });
});
test("GET /signers when has not signed redirects to petition ", () => {
    cookieSession.mockSessionOnce({
        userId: 42
    });
    return supertest(app)
        .get("/signers")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/petition");
        });
});

test("GET /signers/:city when has not signed redirects to petition ", () => {
    cookieSession.mockSessionOnce({
        userId: 42
    });
    return supertest(app)
        .get("/signers/Berlin")
        .expect(302)
        .then(res => {
            expect(res.headers["location"]).toContain("/petition");
        });
});
