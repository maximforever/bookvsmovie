/* dependencies */
    const http = require("http");
    const fs = require("fs");                               // file system
    const path = require("path");                           // access paths
    const express = require("express");                     // express

/* app setup */
    const app = express();                                  // create app
    app.set("port", process.env.PORT || 3000)               // we're gonna start a server on whatever the environment port is or on 3000
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


/* routes */
    app.get("/", function(req, res){
        res.render("index");
    });


    app.post("/", function(req, res){
        res.render("index");
    });


    


