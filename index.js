/* dependencies */
    const http = require("http");
    const fs = require("fs");                               // file system
    const path = require("path");                           // access paths
    const express = require("express");                     // express
    const bodyParser = require('body-parser');              // parse request body
    const parser = require('xml2js');
    const util = require('util');
    const MongoClient = require('mongodb').MongoClient;     // talk to mongo

    var request = require('request');                       // make reuests



/* app setup */
    const app = express();                                  // create app
    app.set("port", process.env.PORT || 3030)               // we're gonna start a server on whatever the environment port is or on 3000
    app.set("views", path.join(__dirname, "/"));            // tells us where our views are
    app.set("view engine", "ejs");                          // tells us what view engine to use

    app.listen(app.get("port"), function() {
        console.log("Server started on port " + app.get("port"));
    });


    if(process.env.LIVE){                                                                           // this is how I do config, folks. put away your pitforks, we're all learning here.
        dbAddress = "mongodb://" + process.env.MLAB_USERNAME + ":" + process.env.MLAB_PASSWORD + "@ds135444.mlab.com:35444/bookvsmovie";
    } else {
        dbAddress = "mongodb://localhost:27017/bookvsmovie";
    }


MongoClient.connect(dbAddress, function(err, db){
    if (err){
        console.log("MAYDAY! MAYDAY! Crashing.");
        return console.log(err);
    }


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

        // write IP to database

        var userInfo = {
          ip: req.connection.remoteAddress,
          time: Date()
        }

        db.collection("ip").save(userInfo, function(err, result){
            if (err){
                console.log("MAYDAY! MAYDAY! Crashing.");
                return console.log(err);
            }
            console.log("Successfully saved this search");
            console.log(result.ops);
        })


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
              movies: null,
              booksFound: false,
              moviesFound: false
            }

            console.log(1)

            // write search result to the database

            var thisSearch = {
               name: req.body.name,
               time: Date()
            }

            db.collection("search").save(thisSearch, function(err, result){
                if (err){
                    console.log("MAYDAY! MAYDAY! Crashing.");
                    return console.log(err);
                }
                console.log("Successfully saved this search");
                console.log(result.ops);
            })



          /* movies */
            request.get("http://www.theimdbapi.org/api/find/movie?title=" + req.body.name, function (error, apiRes, body) {
              console.log(2)
              if (error) {
                console.log(error)
                movieComplete = true
                checkIfDone();
              }
              else {
                if (!body || body == "null" || !body.length) {
                  console.log("no movies")
                  movieComplete = true
                  checkIfDone();
                }
                else {
                  body = JSON.parse(body);
                  var movies = []

                  for(var i = 0; i < body.length; i ++){
                    try {
                      var movie = {
                        title: body[i].title,
                        director: body[i].director,
                        rating: parseFloat(body[i].rating), 
                        rating_count: body[i].rating_count,
                        image: body[i].poster.thumb,
                        year: body[i].release_date.substring(0, 4),
                        url: body[i].url.url
                      }

                      movies.push(movie); 
                    }
                    catch (error) {
                      console.log(error)
                    }
                  }

                  response.movies = movies
                  response.moviesFound = true
                  movieComplete = true
                  checkIfDone();
                }
              }
            });

          /* books */
            request.get("https://www.goodreads.com/search.xml?&key=U1wxZmIggzQZaJYCRmqw&q=" + req.body.name, function (error, apiRes, body) {
              console.log(2)
              if (error) {
                console.log(error)
                bookComplete = true
                checkIfDone()
              } else {
                parser.parseString(body, function(err, result) {
                  var string = util.inspect(result, false, null)
                  eval('var bookObject = new Object(' + string + ')');
                  var works = bookObject.GoodreadsResponse.search[0].results[0].work;

                  if (!works || !works.length) {
                    console.log("no books")
                    bookComplete = true
                    checkIfDone()
                  }
                  else {
                    var books = [];

                    for(var i = 0; i < works.length; i ++){
                      try {
                        var book = {
                          title: works[i].best_book[0].title[0],
                          author: works[i].best_book[0].author[0].name[0],
                          rating: (Number(works[i].average_rating[0]) * 2), 
                          rating_count: works[i].ratings_count[0]._,
                          image: works[i].best_book[0].image_url[0],
                          year: works[i].original_publication_year[0]._,
                          url: "https://www.goodreads.com/book/show/" + (works[i].best_book[0].id[0]._)
                        }

                        books.push(book);
                      }
                      catch (error) {
                        console.log(error)
                      }
                    }

                    response.books = books
                    response.booksFound = true
                    bookComplete = true
                    checkIfDone();
                  }
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

});
    


