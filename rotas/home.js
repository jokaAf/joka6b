module.exports = (app) => {
    // Define your routes
    app.get('/', (req, res) => {
        res.render("home.ejs");
    });
}