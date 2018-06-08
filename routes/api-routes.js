var db = require("../models");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({isSaved:false})
        .then(function(dbArticles) {
            // If we were able to successfully find Articles, send them back to the client
           var obj={
               dbArticle:dbArticles
           }
            res.render("index",obj);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
        
    });

    app.get("/savedArticles", function (req, res) {
        res.render("saved");
    });    

    // A GET route for scraping the echoJS website
    app.get("/scrapeArticles", function (req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.livescience.com/environment?type=article").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $(".mod-copy").each(function (i, element) {
                // Save an empty result object
                var result = {};
                var parentDiv=$(this).parent();    
                // Add the text and href of every link, and save them as properties of the result object
                result.link = "https://www.livescience.com"+parentDiv
                    .children("h2").children("a")
                    .attr("href");
                result.headline = parentDiv
                    .children("h2").children("a")
                    .text().trim();
                result.summary = parentDiv
                    .children("p")
                    .text().trim();
                

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
                    });
            });
            
            
        });
        res.redirect("/");
        
    });

    app.get("/articleSaved/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved:true }, { new: true })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
           // res.json(dbArticle);
           console.log("updated");
           res.json(dbArticle);
           
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
        
    });
    app.get("/mySavedArticles", function (req, res) {
        console.log("inside");
       db.Article.find({isSaved:true})
         .then(function(dbresults) {
            // If we were able to successfully find Articles, send them back to the client
           console.log(dbresults);
           console.log("inside");
            var articleObject={
               savedArticleList:dbresults
           }
            res.render("saved",articleObject);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          }); 
        
    });

};