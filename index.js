/* dependencies */
    const http = require("http");
    const fs = require("fs");                               // file system
    const path = require("path");                           // access paths
    const express = require("express");                     // express
    const bodyParser = require('body-parser');              // parse request body

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
        
        if (!req.body.category) {
            console.log("error: no category")
        }
        else if (req.body.category == "movie") {
            console.log("movie")
            console.log(req.body.name)

            request.get("http://www.theimdbapi.org/api/find/movie?title=" + req.body.name, function (error, apiRes, body) {
              console.log('error:', error); // Print the error if one occurred 
              console.log('statusCode:', apiRes && apiRes.statusCode); // Print the response status code if a response was received 
              console.log('body:', body); // Print the HTML for the Google homepage. 
              res.send(body);
            });

            console.log("out here")
        }
        else if (req.body.category == "book") {
            request.get("https://www.goodreads.com/search.xml?key=U1wxZmIggzQZaJYCRmqw&q=" + req.body.name, function (error, apiRes, body) {
              console.log('error:', error); // Print the error if one occurred 
              console.log('statusCode:', apiRes && apiRes.statusCode); // Print the response status code if a response was received 
              console.log('body:', body); // Print the HTML for the Google homepage. 

              var parser = new DOMParser()
              var doc = parser.parseFromString(body, "application/xml")

              var works = doc.querySelectorAll("work")
                works = Array.prototype.slice.call(works)

                console.log(works[0])




              res.send(body);
            });
        }

    });


    


