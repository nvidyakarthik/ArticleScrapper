var db = require("../models");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({ isSaved: false }).sort({createdDate:-1})
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                var obj = {
                    dbArticle: dbArticles
                }
                res.render("index", obj);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    app.get("/home", function (req, res) {
        db.Article.find({ isSaved: false })
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, send them back to the client
                var obj = {
                    dbArticle: dbArticles
                }
                res.render("index", obj);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });



    app.get("/savedArticles", function (req, res) {
        res.render("saved");
    });

    // A GET route for scraping the livescience website
    app.get("/scrapeArticles", function (req, res) {
        // First, we grab the body of the html with request
        var criteria=[
        "news",
        "technology",
        "health",
        "environment",
        "strange-news",
        "animals",
        "history",
        "culture",
       " space"
        ];
        var randomCriteria = criteria[Math.floor(Math.random()*criteria.length)];
        axios.get("https://www.livescience.com/"+randomCriteria+"?type=article").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            
            // Now, we grab every h2 within an article tag, and do the following:
            $(".mod-copy").each(function (i, element) {
                // Save an empty result object
                var result = {};
                var parentDiv = $(this).parent();
                // Add the text and href of every link, and save them as properties of the result object
                result.link = "https://www.livescience.com" + parentDiv
                    .children("h2").children("a")
                    .attr("href");
                result.headline = parentDiv
                    .children("h2").children("a")
                    .text().trim();
                   
                 var tempString= parentDiv
                    .children("p")
                    .text().trim();
                    result.summary=tempString.replace('  Read More','');


                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        // View the added result in the console
                        console.log(dbArticle);
                       
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        //return res.json(err);
                        console.log(err);
                        //res.json(err);
                    });
            });
            
            return true;

        }).then(function(response){
            return res.redirect("/");
        });
    });

    app.get("/articleSaved/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true }, { new: true })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                // res.json(dbArticle);
                console.log("updated");
                res.json(dbArticle);

            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    app.get("/removeSaved/:id", function (req, res) {
        db.Article.findOneAndRemove({ _id: req.params.id })
            .then(function (dbresponse) {
                // If we were able to successfully update an Article, send it back to the client
                // res.json(dbArticle);
                dbresponse.notes.forEach(element => {
                    db.Note.remove({ _id: element }, function (err, numeffected) {
                        if (err) {
                            console.log(err);

                        }
                    });

                });

                res.json(dbresponse);

            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });
    app.get("/mySavedArticles", function (req, res) {
        console.log("inside");
        db.Article.find({ isSaved: true })
            .then(function (dbresults) {
                // If we were able to successfully find Articles, send them back to the client
                console.log(dbresults);
                console.log("inside");
                var articleObject = {
                    savedArticleList: dbresults
                }
                res.render("saved", articleObject);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });

    });

    // Route for saving/updating an Article's associated Note
    app.post("/saveNote/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                console.log(dbArticle);
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/getNotes/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("notes")
            .then(function (dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/deleteNote/:id", function (req, res) {
        db.Article.update({},
            { $pull: { notes: req.params.id } },
            function (err, numeffected) {
                if (err)
                    return res.json(err);
                db.Note.remove({ _id: req.params.id })
                    .then(function (affectedRows) {
                        console.log("affectedRows" + affectedRows);
                        res.json(affectedRows);

                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        res.json(err);
                    });

            });
    });


};

