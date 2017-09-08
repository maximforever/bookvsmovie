/* dependencies */
    const http = require("http");
    const fs = require("fs");                               // file system
    const path = require("path");                           // access paths
    const express = require("express");                     // express
    const bodyParser = require('body-parser');              // parse request body
    const parser = require('xml2js');
    const util = require('util');

    var request = require('request');                       // make reuests

/* app setup */
    const app = express();                                  // create app
    app.set("port", process.env.PORT || 3030)               // we're gonna start a server on whatever the environment port is or on 3000
    app.set("views", path.join(__dirname, "/"));            // tells us where our views are
    app.set("view engine", "ejs");                          // tells us what view engine to use

    app.listen(app.get("port"), function() {
        console.log("Server started on port " + app.get("port"));
    });


/* middleware */
    app.use(function(req, res, next){
        console.log(req.method.toUpperCase() + " '" + req.url + "' on " + Date.now());  
        next();
    });

    app.use(express.static('assets'));                           // sets the correct views for the CSS file/generally accessing files

    app.use(bodyParser.urlencoded({
        extended: true
    }));


/* routes */
    app.get("/", function(req, res){
        res.render("index");
    });

    app.post("/", function(req, res){
      console.log("request: " + req.body.name)
      if (!req.body.name || req.body.name.trim().length == 0) {
        console.log("no request")
        res.send("no results")
      }
      else {
        try {
          /* status */
            var movieComplete = false
            var bookComplete = false
            var response = {
              books: null,
              movies: null
            }

            console.log(1)

          /* movies */
            request.get("http://www.theimdbapi.org/api/find/movie?title=" + req.body.name, function (error, apiRes, body) {
              console.log(2)
              if (error) {
                movieComplete = true
                console.log(error)
              }
              else {
                body = JSON.parse(body);
                
                var movies = []
                for(var i = 0; i < body.length; i ++){

                  var movie = {
                    title: body[i].title,
                    director: body[i].director,
                    rating: body[i].rating, 
                    rating_count: body[i].rating_count,
                    image: body[i].poster.thumb,
                    date: body[i].release_date,
                    url: body[i].url.url
                  }

                  movies.push(movie); 
                }

                response.movies = movies
                movieComplete = true
                checkIfDone();
              }
            });

          /* books */
            request.get("https://www.goodreads.com/search.xml?&key=U1wxZmIggzQZaJYCRmqw&q=" + req.body.name, function (error, apiRes, body) {
              console.log(2)
              if (error) {
                bookComplete = true
                console.log(error)
              }
              else {
                parser.parseString(body, function(err, result) {
                  var string = util.inspect(result, false, null)
                  eval('var bookObject = new Object(' + string + ')');
                  var works = bookObject.GoodreadsResponse.search[0].results[0].work;

                  var books = [];
                  for(var i = 0; i < works.length; i ++){
                    var book = {
                      title: works[i].best_book[0].title[0],
                      author: works[i].best_book[0].author[0].name[0],
                      rating: (Number(works[i].average_rating[0]) * 2), 
                      rating_count: works[i].ratings_count[0]._,
                      image: works[i].best_book[0].image_url[0],
                      date: works[i].original_publication_month[0]._ + "/" +works[i].original_publication_day[0]._ + "/" + works[i].original_publication_year[0]._,
                      url: "https://www.goodreads.com/book/show/" + (works[i].best_book[0].image_url[0].split(/\/|\./g)[7])
                    }

                    books.push(book); 
                  }

                  response.books = books
                  bookComplete = true
                  checkIfDone();
                })
              }  
            });

          /* response */
            function checkIfDone(){
              console.log(3)
              if (bookComplete && movieComplete){
                console.log(4)
                res.send(response)
              }
            }
        }
        catch (error) {
          console.log(error)
          res.send("no results")
        }
      }

    });


    


